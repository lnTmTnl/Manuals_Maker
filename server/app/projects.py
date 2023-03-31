from flask import Blueprint, request, render_template, jsonify, send_from_directory
import os
from app import app
from sql import db, Projects
from sqlalchemy import select, and_
from tools import toJsonRes
from uuid import uuid1

projects_bp = Blueprint('projects_bp', __name__)

Publish_FOLDER = 'app/published_manuals'
app.config['Publish_FOLDER'] = Publish_FOLDER

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
    else:
        state = 1
        data = res[0].getDict()
        res = jsonify({'data': data, 'state': state})
    return res


@projects_bp.route('/updateProjects', methods=["POST"])
def update_projects():
    id = request.json.get('id')
    userid = request.json.get('userid')
    name = request.json.get('name')
    content = request.json.get('content')
    res = db.session.scalars(select(Projects).where(and_(Projects.userid == userid, Projects.id == id))).all()
    if(len(res) == 0):
        new_project = Projects(id, userid, name, content)
        db.session.add(new_project)
        db.session.commit()
    else:
        db.session.query(Projects).filter(and_(Projects.userid == userid, Projects.id == id)).update({"content":content})
        db.session.commit()
    return toJsonRes(res, 1)

    