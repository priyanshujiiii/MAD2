###################################################################################
###################################################################################
###################################################################################
##########                        Code  Structure                  ################

##########                        1) Library Import                ################
##########                        2) Flask Configurations          ################
##########                        3) Database                      ################
##########                        4) Home Page                     ################
##########                        5) Resources                     ################
##########                        6) Influencer                    ################
##########                        7) Admin                         ################
###################################################################################
###################################################################################
###################################################################################


#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>End<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#

###################################################################################
###################################################################################
###################################################################################
##########                         1) Library Import               ################
###################################################################################
###################################################################################
###################################################################################

import os
from flask import Flask, render_template, request, redirect, url_for, flash,jsonify, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from sqlalchemy import func
from werkzeug.utils import secure_filename
from time import sleep
from flask import redirect, abort
from sqlalchemy.orm import relationship
from flask import flash
from sqlalchemy import desc
from flask_security import UserMixin,RoleMixin,Security,SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_user
from flask_security.models import fsqla_v3 as fsq
from flask_security.utils import hash_password, verify_password
from flask_wtf.csrf import CSRFProtect

#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>End<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#

###################################################################################
###################################################################################
###################################################################################
##########                        2) Flask Configurations          ################
###################################################################################
###################################################################################
###################################################################################

app = Flask(__name__)
security = Security()

current_dir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
app.config['SECRET_KEY'] = 'should-not-be-seen'
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///" + os.path.join(current_dir, "oeanalytics.sqlite3") 

# In your Flask app configuration, add the following settings
app.config['DEBUG'] = True   
app.config['SECURITY_PASSWORD_SALT'] = 'salty-password'
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = 'Authentication-Token'

db = SQLAlchemy()
db.init_app(app)
app.app_context().push()


#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>End<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#

###################################################################################
###################################################################################
###################################################################################
##########                        3) Database                      ################
###################################################################################
###################################################################################
###################################################################################

fsq.FsModels.set_db_info(db)

# Admin Table
class Admin(db.Model):
    __tablename__ = 'admin'
    
    user_id = db.Column(db.String, primary_key=True)
    description = db.Column(db.String, nullable=False)

# Category Table
class Category(db.Model):
    __tablename__ = 'category'
    
    category = db.Column(db.String, primary_key=True, unique=True)
    description = db.Column(db.String, nullable=False)
    date = db.Column(db.String, nullable=False)

# Influencer Table
class Influencer(db.Model):
    __tablename__ = 'influencer'
    
    username = db.Column(db.String, primary_key=True, unique=True)
    address = db.Column(db.String)
    contact = db.Column(db.Numeric)
    district = db.Column(db.String)
    state = db.Column(db.String)
    pincode = db.Column(db.Numeric)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    instagram_id = db.Column(db.String)
    linkedin_id = db.Column(db.String)
    facebook_id = db.Column(db.String)
    x_id = db.Column(db.String)
    category = db.Column(db.String, db.ForeignKey('category.category'))
    insta_f = db.Column(db.Integer)
    linkedin_f = db.Column(db.Integer)
    facebook_f = db.Column(db.Integer)
    x_f = db.Column(db.Integer)
    bio = db.Column(db.String)
    flag = db.Column(db.Integer)
    wallet = db.Column(db.Integer)
    complete = db.Column(db.Integer)

# Role Table
class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255))

# Sponsor Table
class Sponsor(db.Model):
    __tablename__ = 'sponsor'
    
    username = db.Column(db.String, primary_key=True, unique=True)
    address = db.Column(db.String)
    contact = db.Column(db.String)
    district = db.Column(db.String)
    state = db.Column(db.String)
    pincode = db.Column(db.Integer)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    company_name = db.Column(db.String)
    industry = db.Column(db.String)
    positions = db.Column(db.String)
    bio = db.Column(db.String)
    flag = db.Column(db.Integer)
    wallet = db.Column(db.Integer)
    complete = db.Column(db.Integer)
    category = db.Column(db.String, db.ForeignKey('category.category'))

# User Table
class User(db.Model, UserMixin):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean)
    fs_uniquifier = db.Column(db.String(65), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='user_roles')

# UserRoles Association Table
class UserRoles(db.Model):
    __tablename__ = 'user_roles'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id', ondelete='CASCADE'), nullable=False)

    
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>End<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#

###################################################################################
###################################################################################
###################################################################################
##########                        4) Home Page                     ################
###################################################################################
###################################################################################
###################################################################################

@app.route('/', methods=['GET', 'POST'])
def index():
    return redirect(url_for('oeanalytics'))

# 4.0.2 Redirecting App
@app.route('/oeanalytics', methods=['GET', 'POST'])
def oeanalytics():
    return render_template('index.html')

###################################################################################
##########                        4.1) LogIN                       ################
###################################################################################
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security.init_app(app, user_datastore)

app.config['WTF_CSRF_CHECK_DEFAULT'] = False
app.config['SECURITY_CSRF_PROTECT_MECHANISMS'] = ['session', 'form']
app.config['SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS'] = True

@app.route('/signin', methods=['POST'])
def signin():
    print('test.0')
    data = request.get_json()
    print('data:', data)  # Debug the data object here
    if not data:
        return jsonify({'message': 'Invalid JSON'}), 400

    email = data.get('email')
    password = data.get('password')
    print('test.1', 'email:', email, 'password:', password)  # Log credentials for debugging (in real production, avoid logging passwords)

    if not email or not password:
        return jsonify({'message': 'email or password not provided'}), 400

    user = user_datastore.find_user(email=email)
    print('test.2', 'user:', user)  # Verify the user lookup

    if not user:
        return jsonify({'message': 'invalid user'}), 400

    if verify_password(password, user.password):
        token = user.get_auth_token()
        print('token:', token)  # Log the generated token for verification
        return jsonify({'token': token, 'user': user.email, 'role': user.roles[0].name}), 200
    else:
        return jsonify({'message': 'invalid password'}), 400


###################################################################################
##########                        4.2) SignUp                      ################
###################################################################################
@app.route('/Signup', methods=['POST'])
def Signup():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    role = data.get('role')


    if not email or not password or not role:
        return jsonify({'message' : 'invalid input'}), 403

    if user_datastore.find_user(email = email ):
        return jsonify({'message' : 'user already exists'}), 400
    
    if role == 'spon':
        user_datastore.create_user(email = email, password = hash_password(password), active = False, roles = ['spon'])
        db.session.commit()
        return jsonify({'message' : 'Sponser succesfully created, waiting for admin approval'}), 201
    
    elif role == 'influ':
        try :
            user_datastore.create_user(email = email, password = hash_password(password), active = True, roles=['influ']), 201
            db.session.commit()
        except:
            print('error while creating')
        return jsonify({'message' : 'Student successfully created'})
    
    return jsonify({'message' : 'invalid role'}), 400

#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>End<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#

###################################################################################
###################################################################################
###################################################################################
##########                        5) Resources                     ################
###################################################################################
###################################################################################
###################################################################################


#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>End<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#

###################################################################################
###################################################################################
###################################################################################
##########                        6) Influencer                    ################
###################################################################################
###################################################################################
###################################################################################


#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>End<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#

###################################################################################
###################################################################################
###################################################################################
##########                        7) Admin                         ################
###################################################################################
###################################################################################
###################################################################################


#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>End<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#

###################################################################################
###################################################################################
###################################################################################
##########                         1) Library Import               ################
###################################################################################
###################################################################################
###################################################################################

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>End<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
