from flask import Blueprint, request, render_template, jsonify, send_from_directory
import os
import json
from app import app
from sql import db, Manuals, Projects
from sqlalchemy import select, and_
from tools import toJsonRes, getCurrentDate
from uuid import uuid1

manuals_bp = Blueprint('manuals_bp', __name__)

Publish_FOLDER = 'app/published_manuals'
app.config['Publish_FOLDER'] = Publish_FOLDER

@manuals_bp.route('/onlinePublish', methods=["POST"])
def online_publish():
    projectid = request.json.get('projectid')
    userid = request.json.get('userid')
    name = request.json.get('name')
    manualid = uuid1()
    date = getCurrentDate()
    path_url = app.config['Publish_FOLDER'] + '/' + userid
    directory_path = path_url + '/'+ str(manualid)

    res = db.session.scalars(select(Projects).where(and_(Projects.id == projectid))).all()
    project = res[0].getDict()
    stepnames = project.get('content')
    project_directory = app.config['Projects_FOLDER'] + '/' + userid + '/' + projectid
    try:
        if(not os.path.exists(directory_path)):
            os.makedirs(directory_path)
        for step in stepnames:
            with open(project_directory + '/'+ step +'.json', 'r') as project_json:
                json_dict = json.load(project_json)
                json_dict['metadata']['type'] = 'APP'
                json_dict.pop('history')
            file = open(directory_path + '/' + step + '.json', 'w')
            file.write(json.dumps(json_dict))
        #file = open(path_url + '/'+ str(manualid) +'.json', 'w')
        #file.write(content)

        new_manual = Manuals(manualid, userid, name, date, stepnames)
        db.session.add(new_manual)
        db.session.commit()

        return jsonify({'manualid': manualid, 'state': 1})
    except Exception as e:
        return jsonify({'message':'{}'.format(e)})


@manuals_bp.route('/getAllManuals/<path:userid>', methods=["GET"])
def get_all_manuals(userid):
  res = db.session.scalars(select(Manuals).where(and_(Manuals.userid == userid))).all()
  if(len(res) == 0):
      state = 0
  else:
      state = 1
  return toJsonRes(res, state)


@manuals_bp.route('/getAManual/<path:id>', methods=["GET"])
def get_a_manual(id):
    res = db.session.scalars(select(Manuals).where(and_(Manuals.id == id))).all()
    if(len(res) == 0):
        state = 0
        return jsonify({state: 0})
    else:
        state = 1
        data = res[0].getDict()
        userid = data.get('userid')
        stepnames = data.get('content')
        first_step = stepnames[0]
        directory = os.path.join(app.root_path, 'published_manuals' + '/' + str(userid) + '/' + id)
        try:
            with open(directory + '/' + first_step + '.json', 'r') as manual_json:
                manual_dict = json.load(manual_json)
                res = jsonify({'data': manual_dict, 'stepnames': stepnames})
                return res
        except Exception as e:
            return jsonify({'message':'{}'.format(e), state: 0})


@manuals_bp.route('/getManualStep/<path:id>/<path:step>', methods=["GET"])
def get_manual_step(id, step):
    res = db.session.scalars(select(Manuals).where(and_(Manuals.id == id))).all()
    if(len(res) == 0):
        state = 0
        return jsonify({state: 0})
    else:
        state = 1
        data = res[0].getDict()
        userid = data.get('userid')
        stepnames = data.get('content')
        if step not in stepnames:
            return jsonify({'data': {}, 'state': 0})
        directory = os.path.join(app.root_path, 'published_manuals' + '/' + str(userid) + '/' + id)
        try:
            with open(directory + '/' + step + '.json', 'r') as manual_json:
                manual_dict = json.load(manual_json)
                res = jsonify({'data': manual_dict, 'stepnames': stepnames, 'state': 1})
                return res
        except Exception as e:
            return jsonify({'message':'{}'.format(e), state: 0})


@manuals_bp.route('/getAManualInfo/<path:id>', methods=["GET"])
def get_a_manual_info(id):
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