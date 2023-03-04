from flask import Flask

app = Flask(__name__,
            template_folder="../../web/dist",
            static_folder="../../web/dist/",
            static_url_path="")

import routes


from sql import db


with app.app_context():
  db.create_all()
  # sql = 'select * from users'
  # result = db.session.execute(text(sql))
  # print(result)