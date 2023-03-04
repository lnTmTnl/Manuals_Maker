from flask import request, render_template, jsonify
from app import app
from sql import db, Users, Projects, Manuals
from sqlalchemy import select, and_

def toJsonRes(data, state):
    return jsonify({'data': [i.getDict() for i in data], 'state': state})

@app.route("/", methods=["GET", "POST"])
def home():
    return render_template('index.html')

@app.errorhandler(404)
def error_date(err):
    return render_template('index.html')
    
@app.route('/login', methods=["POST"])
def login():
    userid = request.json.get('id')
    password = request.json.get('password')
    res = db.session.scalars(select(Users).where(and_(Users.id == userid, Users.password == password))).all()
    if(len(res) == 0):
        state = 0
    else:
        state = 1
    return toJsonRes(res, state)