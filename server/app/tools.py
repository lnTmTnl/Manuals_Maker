from flask import jsonify
import datetime
import pytz

def toJsonRes(data, state):
    return jsonify({'data': [i.getDict() for i in data], 'state': state})

def getCurrentDate():
    now = datetime.datetime.now()
    local_tz = pytz.timezone('Asia/Shanghai')
    local_time = local_tz.localize(now)
    formatted_time = local_time.strftime("%Y-%m-%d %H:%M:%S")
    return formatted_time