from flask import Blueprint, request, render_template, jsonify, redirect, url_for, send_from_directory, make_response
from werkzeug.utils import secure_filename
import os
from app import app
from sql import db, Resources
from sqlalchemy import select, and_
from tools import toJsonRes

resources_bp = Blueprint('resources_bp', __name__)

UPLOAD_FOLDER = 'app/uploaded_resources'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@resources_bp.route('/getAllResources', methods=["POST"])
def get_all_resources():
    userid = request.json.get('userid')
    res = db.session.scalars(select(Resources).where(and_(Resources.userid == userid))).all()
    if(len(res) == 0):
        state = 0
    else:
        state = 1
    return toJsonRes(res, state)


@resources_bp.route('/getAResources', methods=["POST"])
def get_a_resources():
    userid = request.json.get('userid')
    res = db.session.scalars(select(Resources).where(and_(Resources.userid == userid))).all()
    if(len(res) == 0):
        state = 0
    else:
        state = 1
        data = res[0].getDict()
        res = jsonify({'data': data, 'state': state})
    return res


@resources_bp.route('/updateResources', methods=["POST"])
def update_resources():
    userid = request.json.get('userid')
    content = request.json.get('content')
    res = db.session.scalars(select(Resources).where(and_(Resources.userid == userid))).all()
    if(len(res) == 0):
        new_resources = Resources(userid, content)
        db.session.add(new_resources)
        db.session.commit()
    else:
        db.session.query(Resources).filter(and_(Resources.userid == userid)).update({"content":content})
        db.session.commit()
    return toJsonRes(res, 1)


@resources_bp.route('/uploadResources', methods=['POST'])
def upload_resources():
    routes_path = request.form.get('path')
    files = request.files.getlist('file')
    path_url = app.config['UPLOAD_FOLDER'] + routes_path
    paths = []
    if(not os.path.exists(path_url)):
        os.makedirs(path_url)
    for file in files:
        filename = secure_filename(file.filename)
        file.save(os.path.join(path_url, filename))
        paths.append(path_url + '/' + filename)
    return routes_path


@resources_bp.route('/createNewFolder', methods=['POST'])
def create_new_folder():
    routes = request.form.get('path')
    path_url = app.config['UPLOAD_FOLDER'] + routes
    if(not os.path.exists(path_url)):
        os.makedirs(path_url)
    return {'path': path_url, 'state': 1}


@resources_bp.route('/uploads/<paths>')
def download_file(paths):
    return send_from_directory(app.config["UPLOAD_FOLDER"], paths)


@resources_bp.route('/getFile/<path:filename>')
def get_file(filename):
    print(filename)
    # path = request.json.get('path')
    # filename = secure_filename(request.json.get('filename'))
    directory = os.path.join(app.root_path, 'uploaded_resources')
    try:
        response = send_from_directory(directory, filename, as_attachment=True)
        return response
    except Exception as e:
        return jsonify({'message':'{}'.format(e)})