from flask import Blueprint, request, render_template, jsonify, send_from_directory
import os
from app import app
from sql import db, Manuals
from sqlalchemy import select, and_
from tools import toJsonRes
from uuid import uuid1

manuals_bp = Blueprint('manuals_bp', __name__)

@manuals_bp.route('/onlinePublish', methods=["POST"])
def online_publish():
    userid = request.json.get('userid')
    name = request.json.get('name')
    path = request.json.get('path')
    content = request.json.get('content')
    manualid = uuid1()
    path_url = app.config['Publish_FOLDER'] + path
    try:
        if(not os.path.exists(path_url)):
            os.makedirs(path_url)
        file = open(path_url + '/'+ str(manualid) +'.json', 'w')
        file.write(content)

        new_manual = Manuals(manualid, userid, name)
        db.session.add(new_manual)
        db.session.commit()

        return jsonify({'manualid': manualid, 'content': content, 'state': 1})
    except Exception as e:
        return jsonify({'message':'{}'.format(e)})


@manuals_bp.route('/getAllManuals', methods=["POST"])
def get_all_manuals():
  userid = request.json.get('userid')
  res = db.session.scalars(select(Manuals).where(and_(Manuals.userid == userid))).all()
  if(len(res) == 0):
      state = 0
  else:
      state = 1
  return toJsonRes(res, state)


@manuals_bp.route('/getAManual', methods=["POST"])
def get_a_manual():
    id = request.json.get('id')
    res = db.session.scalars(select(Manuals).where(and_(Manuals.id == id))).all()
    if(len(res) == 0):
        state = 0
        return jsonify({state: 0})
    else:
        state = 1
        data = res[0].getDict()
        userid = data.get('userid')
        directory = os.path.join(app.root_path, 'published_manuals' + '/' + str(userid))
        try:
          manual_json = send_from_directory(directory, id + '.json', as_attachment=True)
          res = manual_json
          return res
        except Exception as e:
          return jsonify({'message':'{}'.format(e), state: 0})


@manuals_bp.route('/getAManualInfo', methods=["POST"])
def get_a_manual_info():
    id = request.json.get('id')
    res = db.session.scalars(select(Manuals).where(and_(Manuals.id == id))).all()
    if(len(res) == 0):
        state = 0
        return jsonify({state: 0})
    else:
        data = res[0].getDict()
        userid = data.get('userid')
        return jsonify({'userid': userid, 'state': 1})

@manuals_bp.route('/deleteAManual/<path:manualid>', methods=['DELETE'])
def delete_a_manual(manualid):
    res = db.session.scalars(select(Manuals).where(and_(Manuals.id == manualid))).all()
    if(len(res) == 0):
        state = 0
        return jsonify({state: 0})
    else:
        data = res[0].getDict()
        userid = data.get('userid')
        directory = os.path.join(app.root_path, 'published_manuals'+ '/' + str(userid))
        try:
            os.remove(directory + '/' + manualid + '.json')
            Manuals.query.filter_by(id=manualid).delete()
            db.session.commit()
            return jsonify({'message': 'File deleted successfully'})
        except Exception as e:
            return jsonify({'error': str(e)})