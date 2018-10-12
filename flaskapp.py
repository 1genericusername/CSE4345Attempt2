from flask import Flask,render_template,request,make_response,send_file,flash,redirect,session,abort
import pymysql.cursors
import buildingid.v3
import buildingid.wkt
import json
import csv
import pandas as pd
import datetime
import os
from flask_cors import CORS, cross_origin

flask_folder_path = "/home/ubuntu/flaskapp/static"
app = Flask(__name__)
app.config['SESSION_TYPE'] = 'memcached'
app.secret_key = os.urandom(12)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Note: All password information should be encoded via PHP for SQL Database logins
# All passwords for the login page should be checked by the SQL DB instead of hard coded
# Pymysql is well maintained SQL interface for Python compared to SQLAlchemy
# Email warley.sam@gmail.com for any questions about the code or clarification

connection = pymysql.connect(host='localhost',
                             user='swarley',
                             password='swarley2018',
                             db='usgbc_ubid',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


@app.route('/')
@app.route('/home')
@cross_origin()
def home():
	if not session.get('logged_in'):
		return render_template('login.html')
	else:
		return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
	if request.method == 'POST':
		if request.form['password'] == 'software2018' and request.form['username'] == 'admin':
			session['logged_in'] = True
		else:
			flash('Wrong password!')
		return home()
	else:
		if not session.get('logged_in'):
			return render_template('login.html')
		else:
			return render_template('home.html')

@app.route("/logout")
def logout():
	session['logged_in'] = False
	return home()

@app.route('/modal')
def modal():
	return render_template('modal.html')

@app.route('/modalv2')
def modalv2():
	return render_template('modal_v2_other.html')

# ALL CSV functions are not used currently, Built for interface without the SQL Server

@app.route('/return-csv/')
def return_files():
	try:
		return send_file(flask_folder_path + '/dataUSGBC.csv', mimetype='text/csv', attachment_filename=
			'dataUSGBC_{date:%Y-%m-%d_%H-%M}.csv'.format( date=datetime.datetime.now() ), as_attachment=True)
	except Exception as e:
		return str(e)

@app.route('/remove-last-csv')
def remove_last_row():
	data_frame = pd.read_csv(flask_folder_path + '/dataUSGBC.csv')
	if len(data_frame) > 1:
		data_frame.drop(data_frame.index[len(data_frame)-1]).to_csv(flask_folder_path + '/dataUSGBC.csv',
		 index=False, quoting=csv.QUOTE_NONNUMERIC)
	return render_template('home.html')

@app.route('/view-csv/')
def open_csv_html():
	return render_template('output-csv.html')

if __name__ == '__main__':
	app.run()
