from flask import jsonify

def toJsonRes(data, state):
    return jsonify({'data': [i.getDict() for i in data], 'state': state})