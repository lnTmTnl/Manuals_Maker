from flask_sqlalchemy import SQLAlchemy

from app import app

app.config['SECRET_KEY']='123456' # 密码
app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://root:123456@localhost:3306/manuals-maker'
    # 协议：mysql+pymysql
    # 用户名：root
    # 密码：123456
    # IP地址：localhost
    # 端口：3306
    # 数据库名：manuals-maker
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN']=True
db=SQLAlchemy(app)

# 新建表User
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True) # id字段，int类型，主键
    name = db.Column(db.String, unique=False) # name字段，字符串类型，不唯一
    password = db.Column(db.String, unique=False)

    def getDict(self):
        return {i.name: getattr(self, i.name) for i in self.__table__.columns}

class Projects(db.Model):
    def __init__(self, id, userid, name, content):
        self.id = id
        self.userid = userid
        self.name = name
        self.content = content

    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey(Users.id))
    name = db.Column(db.String, unique=False)
    content = db.Column(db.JSON, unique=False)

    def getDict(self):
        return {i.name: getattr(self, i.name) for i in self.__table__.columns}

class Manuals(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey(Users.id))
    name = db.Column(db.String, unique=False)
    content = db.Column(db.JSON, unique=False)

    def getDict(self):
        return {i.name: getattr(self, i.name) for i in self.__table__.columns}

class Resources(db.Model):
    def __init__(self, userid, content):
        self.userid = userid
        self.content = content
    userid = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.JSON, unique=False)

    def getDict(self):
        return {i.name: getattr(self, i.name) for i in self.__table__.columns}