from flask import Blueprint, request, render_template, jsonify, send_from_directory
import os
from app import app
from sql import db, Projects
from sqlalchemy import select, and_, cast, VARCHAR
from tools import toJsonRes, getCurrentDate
from uuid import uuid1
import datetime

projects_bp = Blueprint('projects_bp', __name__)

Projects_FOLDER = 'app/saved_projects'
app.config['Projects_FOLDER'] = Projects_FOLDER

@projects_bp.route('/getAllProjects', methods=["POST"])
def get_all_projects():
    userid = request.json.get('userid')
    res = db.session.scalars(select(Projects).where(and_(Projects.userid == userid))).all()
    if(len(res) == 0):
        state = 0
    else:
        state = 1
    return toJsonRes(res, state)


@projects_bp.route('/getAProject', methods=["POST"])
def get_a_project():
    id = request.json.get('id')
    userid = request.json.get('userid')
    res = db.session.scalars(select(Projects).where(and_(Projects.userid == userid, Projects.id == id))).all()
    if(len(res) == 0):
        state = 0
        return jsonify({state: 0})
    else:
        state = 1
        data = res[0].getDict()
        directory = os.path.join(app.root_path, 'saved_projects'+ '/' + str(userid))
        try:
          project_json = send_from_directory(directory, id + '.json', as_attachment=True)
          res = project_json
          return res
        except Exception as e:
          return jsonify({'message':'{}'.format(e), state: 0})


@projects_bp.route('/getAProjectInfo', methods=["POST"])
def get_a_project_info():
    id = request.json.get('id')
    userid = request.json.get('userid')
    res = db.session.scalars(select(Projects).where(and_(Projects.userid == userid, Projects.id == id))).all()
    if(len(res) == 0):
        return jsonify({'state': 0})
    else:
        data = res[0].getDict()
        return jsonify({'data': data, 'state': 1})


@projects_bp.route('/getAStep/<path:id>/<path:step>', methods=["GET"])
def get_a_step(id, step):
    res = db.session.scalars(select(Projects).where(and_(Projects.id == id))).all()
    if(len(res) == 0):
        return jsonify({'state': 0})
    else:
        project = res[0].getDict()
        userid = project.get('userid')
        stepnames = project.get('content')
        if step not in stepnames:
            return jsonify({'state': 0})
        else:
            directory = os.path.join(app.root_path, 'saved_projects'+ '/' + str(userid) + '/' + id)
            try:
                project_json = send_from_directory(directory, step + '.json', as_attachment=True)
                return project_json
            except Exception as e:
                return jsonify({'message':'{}'.format(e), 'state': 0})


@projects_bp.route('/updateProjects', methods=["POST"])
def update_projects():
    id = request.json.get('id')
    userid = request.json.get('userid')
    name = request.json.get('name')
    step = request.json.get('step')
    content = request.json.get('content')
    date = getCurrentDate()

    directory_path = app.config['Projects_FOLDER'] + '/' + str(userid) + '/' + id
    file_path = directory_path + '/' + step +'.json'
    try:
        if(not os.path.exists(directory_path)):
            os.makedirs(directory_path)
        file = open(file_path, 'w')
        file.write(content)

        res = db.session.query(Projects).filter((cast(Projects.id, VARCHAR) == id) & (Projects.userid == userid)).all()
        if(len(res) == 0):
            new_project = Projects(id, userid, name, [step], date)
            db.session.add(new_project)
            db.session.commit()
        else:
            stepnames = res[0].get('content')
            if step not in stepnames:
                stepnames.append(step)
            db.session.query(Projects).filter((cast(Projects.id, VARCHAR) == id) & (Projects.userid == userid)).update({"content":stepnames, 'date': date})
            db.session.commit()
        return toJsonRes(res, 1)
    except Exception as e:
        return jsonify({'message':'{}'.format(e)})

    
@projects_bp.route('/deleteProject', methods=['DELETE'])
def delete_project():
    id = request.json.get('id')
    userid = request.json.get('userid')
    try:
        db.session.query(Projects).filter((cast(Projects.id, VARCHAR) == id) & (Projects.userid == userid)).delete()
        db.session.commit()
        return jsonify({'message': 'Project deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})