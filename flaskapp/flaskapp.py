from flask import Flask, request, jsonify, render_template, redirect
from flask_login import LoginManager, current_user, login_user, logout_user, login_required, UserMixin
import os
import json
import pusher
from datetime import datetime
from database import db_session
from models import Class
from config import Config
from flask_cors import CORS, cross_origin

app = Flask(__name__)

app.config.from_object(Config)

login = LoginManager(app)


pusher_client = pusher.Pusher(
    app_id='639453',
    key='989251a250c4490baf73',
    secret='726b8083be6dae5d3111',
    cluster='us2',
    ssl=True)

cors = CORS(app)


@app.route('/')
def index():
    classes = Class.query.all()
    return render_template('index.html', classes=classes)

@app.route('/home')
def home():
    classes = Class.query.all()
    return render_template('index.html', classes=classes)


@app.route('/editClass', methods=['POST', 'GET'])
def editClass():
    if request.method == "POST":
        class_name = request.form["class_name"]
        dept = request.form["dept"]
        number = request.form["number"]
        desc = request.form["desc"]
        new_class = Class(class_name, dept, number, desc)
        db_session.add(new_class)
        db_session.commit()
        data = {
                "id": new_class.id,
                "class_name": class_name,
                "dept": dept,
                "number": number,
                "desc": desc}

        pusher_client.trigger('table', 'new-class', {'data': data })

        return redirect("/editClass", code=302)
    else:
        classes = Class.query.all()
        return render_template('edit-class.html', classes=classes)

@app.route('/edit/<int:id>', methods=['POST', 'GET'])
def update_class(id):
    if request.method == "POST":
        class_name = request.form["class_name"]
        dept = request.form["dept"]
        number = request.form["number"]
        desc = request.form["desc"]

        update_class = Class.query.get(id)
        update_class.class_name = class_name
        update_class.dept = dept
        update_class.number = number
        update_class.desc = desc
        db_session.commit()

        return redirect("/editClass", code=302)
    else:
        new_class = Class.query.get(id)

        return render_template('update_class.html', data=new_class)

@app.route('/remove/<int:id>', methods=['DELETE'])
def remove_class(id):
    Class.query.filter_by(id=id).delete()
    db_session.commit()
    pusher_client.trigger('table', 'remove-class', {'id': id })
    return 'OK'


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()
# run Flask app
if __name__ == "__main__":
	app.run()
