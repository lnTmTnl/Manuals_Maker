from flask import Flask

app = Flask(__name__,
            template_folder="../../web/dist",
            static_folder="../../web/dist/",
            static_url_path="")

import routes
from projects import projects_bp
from resources import resources_bp
from manuals import manuals_bp
from sql import db

app.register_blueprint(projects_bp)
app.register_blueprint(resources_bp)
app.register_blueprint(manuals_bp)

with app.app_context():
  db.create_all()
  # sql = 'select * from users'
  # result = db.session.execute(text(sql))
  # print(result)