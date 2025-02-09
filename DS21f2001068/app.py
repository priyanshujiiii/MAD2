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
################################sk###################################################
################################sk###################################################
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
from flask import Flask, render_template, request, redirect, url_for, flash,jsonify, session,send_file
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from sqlalchemy import func
from werkzeug.utils import secure_filename
from time import sleep
from flask import redirect, abort
from sqlalchemy.orm import relationship
from flask import flash
from sqlalchemy import desc
from flask_security import UserMixin,RoleMixin,Security,SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_user,auth_required, roles_required,roles_accepted
from flask_security.models import fsqla_v3 as fsq
from flask_security.utils import hash_password, verify_password
from flask_wtf.csrf import CSRFProtect
from flask_restful import Resource,Api, reqparse, marshal_with, fields
from flask_caching import Cache
from worker import celery_init_app
from celery.result import AsyncResult
from tasks import add, generate_pdf_task,daily_reminder,send_daily_influencer_reminders,send_daily_sponsor_reminders,send_monthly_influencer_report
from celery import shared_task
from jinja2 import Template
from weasyprint import HTML
import os
from celery.beat import crontab
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
cache = Cache()
current_dir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
app.config['SECRET_KEY'] = 'should-not-be-seen'
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///" + os.path.join(current_dir, "oeanalytics.sqlite3") 

# In your Flask app configuration, add the following settings
app.config['DEBUG'] = True   
app.config['SECURITY_PASSWORD_SALT'] = 'salty-password'
app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = 'Authentication-Token'

# cache config
app.config["CACHE_TYPE"]= "RedisCache"  # Flask-Caching related configs
app.config['CACHE_REDIS_HOST'] = 'localhost'
app.config['CACHE_REDIS_PORT'] = 6379
app.config['CACHE_REDIS_DB'] = 0
app.config['CACHE_REDIS_URL'] = 'redis://localhost:6379/0'
app.config["CACHE_DEFAULT_TIMEOUT"]= 300
cache.init_app(app)
db = SQLAlchemy()
db.init_app(app)
app.app_context().push()
celery_app = celery_init_app(app)

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

# Category Table
class Category(db.Model):
    __tablename__ = 'category'
    
    category = db.Column(db.String, primary_key=True, unique=True)
    description = db.Column(db.String, nullable=False)
    date = db.Column(db.String, nullable=False)


# Role Table
class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(255))

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


class Campaign(db.Model):
    __tablename__ = 'campaign'
    
    campaignid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    campaignname = db.Column(db.String, nullable=False)
    category = db.Column(db.String, db.ForeignKey('category.category'), nullable=False)
    goals = db.Column(db.String, nullable=False)
    email = db.Column(db.String, db.ForeignKey('sponsor.email'), nullable=False)
    campaign_description = db.Column(db.String, nullable=False)
    start_date = db.Column(db.String, nullable=False)
    end_date = db.Column(db.String, nullable=False)
    visibility = db.Column(db.String, nullable=False)
    budget = db.Column(db.Integer, nullable=False)
    flag = db.Column(db.Integer, nullable=False)
    alloted = db.Column(db.Integer, nullable=False)
    payment = db.Column(db.Integer, nullable=False)
    approval = db.Column(db.Integer, nullable=False)

class Influencer(db.Model):
    __tablename__ = 'influencer'
    
    email = db.Column(db.String, primary_key=True)
    address = db.Column(db.String, nullable=False)
    contact = db.Column(db.Numeric, nullable=False)
    district = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)
    pincode = db.Column(db.Numeric, nullable=False)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    instagram_id = db.Column(db.String, nullable=False)
    linkedin_id = db.Column(db.String, nullable=False)
    facebook_id = db.Column(db.String, nullable=False)
    x_id = db.Column(db.String, nullable=False)
    category = db.Column(db.String, db.ForeignKey('category.category'), nullable=False)
    insta_f = db.Column(db.Integer, nullable=False)
    linkedin_f = db.Column(db.Integer, nullable=False)
    facebook_f = db.Column(db.Integer, nullable=False)
    x_f = db.Column(db.Integer, nullable=False)
    bio = db.Column(db.String, nullable=False)
    flag = db.Column(db.Integer, nullable=False)
    wallet = db.Column(db.Integer, nullable=False)

class Payment(db.Model):
    __tablename__ = 'payment'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    influencer_email = db.Column(db.String, db.ForeignKey('influencer.email'), nullable=False)
    sponser_email = db.Column(db.String, db.ForeignKey('sponsor.email'), nullable=False)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.campaignid'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Integer, nullable=False)
    campaign_name = db.Column(db.String, nullable=False)

class Request(db.Model):
    __tablename__ = 'request'
    
    request_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    influencer_email = db.Column(db.String, db.ForeignKey('influencer.email'), nullable=False)
    sponser_email = db.Column(db.String, db.ForeignKey('sponsor.email'), nullable=False)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.campaignid'), nullable=False)
    campaign_name = db.Column(db.String, nullable=False)
    status = db.Column(db.Integer, nullable=False)
    payment_amount = db.Column(db.Integer, nullable=False)
    requirements = db.Column(db.String, nullable=False)
    messages = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)
    category = db.Column(db.String, db.ForeignKey('category.category'), nullable=False)

class Sponsor(db.Model):
    __tablename__ = 'sponsor'
    
    email = db.Column(db.String, primary_key=True)
    address = db.Column(db.String, nullable=False)
    contact = db.Column(db.String, nullable=False)
    district = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)
    pincode = db.Column(db.Integer, nullable=False)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    company_name = db.Column(db.String, nullable=False)
    industry = db.Column(db.String, db.ForeignKey('category.category'), nullable=False)
    positions = db.Column(db.String, nullable=False)
    bio = db.Column(db.String, nullable=False)
    flag = db.Column(db.Integer, nullable=False)
    wallet = db.Column(db.Integer, nullable=False)
    approval = db.Column(db.Integer, nullable=False)


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

    data = request.get_json()
    # Debug the data object here
    if not data:
        return jsonify({'message': 'Invalid JSON'}), 400

    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'email or password not provided'}), 400

    user = user_datastore.find_user(email=email)
   

    if not user:
        return jsonify({'message': 'invalid user'}), 400

    if verify_password(password, user.password):
        token = user.get_auth_token()
        
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
        user_datastore.create_user(email = email, password = hash_password(password), active = True, roles = ['spon'])
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


parser = reqparse.RequestParser() # if a client is sending data, it will convert into a dict
api = Api(prefix='/oeanalytics')

CategoryResources ={
    'category': fields.String,
    'description': fields.String,
    'date': fields.String  
}

CategoryResourcess = {
    'category': fields.String,
    'count': fields.Integer
}

class CategoryResource(Resource):
    @cache.cached(timeout=100)
    @marshal_with(CategoryResources)
    def get(self):
        category = Category.query.all()
        return category
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        data = request.get_json()

        # Check if 'category', 'description', and 'date' are in the request data
        if 'category' not in data or 'description' not in data or 'date' not in data:
            return {'message': 'Missing required fields: category, description, and date'}, 400
        
        # Check if the category already exists
        if Category.query.filter_by(category=data['category']).first():
            return {'message': 'Category already exists'}, 409

        # Create a new Category instance
        new_category = Category(
            category=data['category'],
            description=data['description'],
            date=datetime.now().strftime('%H:%M:%S')
        )
        
        # Add the new category to the database
        db.session.add(new_category)
        db.session.commit()
        
        return {'message': 'Category created successfully'}, 201

    @auth_required('token')
    @roles_required('admin')
    def patch(self):
    # Retrieve JSON data from the request
        data = request.get_json()

        # Fetch the category name from the JSON payload
        category_name = data.get('category')
        if not category_name:
            return {'message': 'Category name is required.'}, 400

        # Fetch the category using the category name
        category = Category.query.get_or_404(category_name)

        # Conditionally update fields based on JSON data
        if 'description' in data:
            category.description = data['description']
        if 'date' in data:
            category.date = data['date']

        # Commit changes to the database
        db.session.commit()

        return {'message': 'Category partially updated successfully'}, 200

    @auth_required('token')
    @roles_required('admin')
    def delete(self):
        # Retrieve JSON data from the request
        data = request.get_json()

        # Fetch the category name from the JSON payload
        category_name = data.get('category')
        if not category_name:
            return {'message': 'Category name is required.'}, 400

        # Fetch the category using the category name
        category = Category.query.get_or_404(category_name)

        # Delete the category from the database
        db.session.delete(category)
        db.session.commit()

        return {'message': 'Category deleted successfully'}, 200
    
    @auth_required('token')
    @roles_accepted('admin','influ')
    @marshal_with(CategoryResourcess)
    def put(self):
        result = (
            db.session.query(
                Category.category,
                func.count(Campaign.campaignid).label("count")
            )
            .outerjoin(Campaign, (Category.category == Campaign.category) & (Campaign.alloted == 0) & (Campaign.flag == 0))
            .group_by(Category.category)
            .all()
        )

        # Convert query result to a list of dictionaries
        data = [{"category": category, "count": count} for category, count in result]
        # Return JSON response (for a Flask route)
        return data,200


api.add_resource(CategoryResource, '/categories')

campaign_fields = {
    'campaignid': fields.Integer,
    'campaignname': fields.String,
    'category': fields.String,
    'goals': fields.String,
    'email': fields.String,
    'campaign_description': fields.String,
    'start_date': fields.String,
    'end_date': fields.String,
    'visibility': fields.String,
    'budget': fields.Integer,
    'flag': fields.Integer,
    'alloted': fields.Integer,
    'payment': fields.Integer,
    'approval':fields.Integer
}

influencer_fields = {
    'email': fields.String,
    'address': fields.String,
    'contact': fields.String,
    'district': fields.String,
    'state': fields.String,
    'pincode': fields.String,
    'first_name': fields.String,
    'last_name': fields.String,
    'instagram_id': fields.String,
    'linkedin_id': fields.String,
    'facebook_id': fields.String,
    'x_id': fields.String,
    'category': fields.String,
    'insta_f': fields.Integer,
    'linkedin_f': fields.Integer,
    'facebook_f': fields.Integer,
    'x_f': fields.Integer,
    'bio': fields.String,
    'flag': fields.Integer,
    'wallet': fields.Integer
}

payment_fields = {
    'id': fields.Integer,
    'influencer_email': fields.String,
    'sponser_email': fields.String,
    'campaign_id': fields.Integer,
    'amount': fields.Integer,
    'status': fields.Integer,
    'campaign_name': fields.String
}

request_fields = {
    'request_id': fields.Integer,
    'influencer_email': fields.String,
    'sponser_email': fields.String,
    'campaign_id': fields.Integer,
    'campaign_name': fields.String,
    'status': fields.Integer,
    'payment_amount': fields.Integer,
    'requirements': fields.String,
    'messages': fields.String,
    'role': fields.String,
    'category': fields.String
}

sponsor_fields = {
    'email': fields.String,
    'address': fields.String,
    'contact': fields.String,
    'district': fields.String,
    'state': fields.String,
    'pincode': fields.Integer,
    'first_name': fields.String,
    'last_name': fields.String,
    'company_name': fields.String,
    'industry': fields.String,
    'positions': fields.String,
    'bio': fields.String,
    'flag': fields.Integer,
    'wallet': fields.Integer,
    'approval':fields.Integer
}

# API Resources

class CampaignAPI(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    @cache.cached(timeout=100)
    @marshal_with(campaign_fields)
    def get(self):
        campaigns = Campaign.query.all()
        return campaigns, 200

    @auth_required('token')
    @roles_accepted('spon','influ','admin')
    @marshal_with(campaign_fields)
    def post(self):
        data = request.get_json()
        new_campaign = Campaign(
            campaignname=data['campaignname'],
            category=data['category'],
            goals=data['goals'],
            email=data['email'],
            campaign_description=data['campaign_description'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            visibility=data['visibility'],
            budget=data['budget'],
            flag=data['flag'],
            alloted=data['alloted'],
            payment=data['payment'],
            approval=0
        )
        db.session.add(new_campaign)
        db.session.commit()
        return new_campaign, 201

    @auth_required('token')
    @roles_accepted('spon', 'influ', 'admin')
    @marshal_with(campaign_fields)
    def patch(self):
        data = request.get_json()
        print(data)
        campaign = Campaign.query.get(data['campaign_id'])
        if not campaign:
            return {'message': 'Campaign not found'}, 404

        for key, value in data.items():
            setattr(campaign, key, value)  # This updates the campaign fields with the new values.
            if key == 'flag':
                print(campaign.campaignid)
                if value == 1:
                    requests = Request.query.filter_by(status=0, campaign_id=campaign.campaignid).all()
                    for request1 in requests:
                        request1.status = 4
                    db.session.commit()
                else:
                    requests = Request.query.filter_by(status=4, campaign_id=campaign.campaignid).all()
                    for request1 in requests:
                        request1.status = 0
                    db.session.commit()
        
        db.session.commit()
        return campaign, 200

    
    @auth_required('token')
    @roles_accepted('spon','influ','admin')
    def delete(self):
        data = request.get_json()
        campaign = Campaign.query.get(data['campaignid'])
        if not campaign:
            return {'message': 'Campaign not found'}, 404
        
        db.session.delete(campaign)
        db.session.commit()
        return {'message': 'Campaign deleted'}, 200
    
    @auth_required('token') 
    @roles_accepted('spon','influ','admin')
    @marshal_with(campaign_fields)
    def put(self):
        data = request.get_json()
        desired_category = data.get('category')

        # Filter campaigns based on the specified conditions
        if desired_category:
            campaigns = Campaign.query.filter_by(
                category=desired_category,
                alloted=0,
                flag=0,  # Corrected spelling
                visibility='Public'  # Assuming visibility is case-sensitive
            ).all()
            return campaigns, 200


        role = data.get('role')
        email = data.get('email')
        if role:
            if role == 'spon':
                campaigns = Campaign.query.filter_by(email=email).all()
                return campaigns,200
        
        if role:
            if role =='influ':
                campaigns = (
                    db.session.query(Campaign)
                    .join(Request, Campaign.campaignid == Request.campaign_id)
                    .filter(Request.influencer_email == email, Request.status == 1)
                    .all()
                )
                return campaigns,200
        
        id = data.get('id')
        if id:
            campaign = Campaign.query.filter_by(campaignid=id).first()
            return campaign,200
            
            
        
        

class InfluencerAPI(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    @cache.cached(timeout=100)
    @marshal_with(influencer_fields)
    def get(self):
        influencers = Influencer.query.all()
        return influencers, 200

    @auth_required('token')
    @roles_accepted('influ')
    @marshal_with(influencer_fields)
    def post(self):
        data = request.get_json()
        new_influencer = Influencer(
            email=data['email'],
            address=data['address'],
            contact=data['contact'],
            district=data['district'],
            state=data['state'],
            pincode=data['pincode'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            instagram_id=data['instagram_id'],
            linkedin_id=data['linkedin_id'],
            facebook_id=data['facebook_id'],
            x_id=data['x_id'],
            category=data['category'],
            insta_f=data['insta_f'],
            linkedin_f=data['linkedin_f'],
            facebook_f=data['facebook_f'],
            x_f=data['x_f'],
            bio=data['bio'],
            flag=data['flag'],
            wallet=data['wallet']
        )
        db.session.add(new_influencer)
        db.session.commit()
        return new_influencer, 201

    @auth_required('token')
    @roles_accepted('influ','admin')
    @marshal_with(influencer_fields)
    def patch(self):
        data = request.get_json()
        influencer = Influencer.query.get(data['email'])
        if not influencer:
            return {'message': 'Influencer not found'}, 404

        for key, value in data.items():
            setattr(influencer, key, value)
            if key == 'flag':
                if value == 1:
                    requests = Request.query.filter_by(status=0, influencer_email=data['email']).all()
                    for request1 in requests:
                        request1.status = 5
                    db.session.commit()
                else:
                    requests = Request.query.filter_by(status=5, influencer_email=data['email']).all()
                    for request1 in requests:
                        request1.status = 0
                    db.session.commit()


        db.session.commit()
        return influencer, 200

    @auth_required('token')
    def delete(self):
        data = request.get_json()
        influencer = Influencer.query.get(data['email'])
        if not influencer:
            return {'message': 'Influencer not found'}, 404
        
        db.session.delete(influencer)
        db.session.commit()
        return {'message': 'Influencer deleted'}, 200
    
    @auth_required('token')
    #@roles_accepted()
    @marshal_with(influencer_fields)
    def put(self):
        data = request.get_json()
        campaign_id = data.get('campaign_id')
        if campaign_id:
            subquery = db.session.query(Request.influencer_email).filter(
                Request.campaign_id == data['campaign_id']
            ).subquery()
            
            # Query influencers whose email is not in the subquery (i.e., not in the request table for that campaign_id)
            influencers_not_in_request_for_campaign = db.session.query(Influencer).filter(
                ~Influencer.email.in_(subquery)
            ).all()
            return influencers_not_in_request_for_campaign,200
        
        # Check if email is present and the influencer exists
        influencer = Influencer.query.get(data['email'])
        if not influencer:
            return {'message': 'Influencer not found'}, 404
        
        
        # If influencer exists, get the sponsors associated with this email
        sponsors = Influencer.query.filter_by(email=data['email']).all()
        return sponsors, 200


class PaymentAPI(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    @cache.cached(timeout=100)
    @marshal_with(payment_fields)
    def get(self):
        payments = Payment.query.all()
        return payments, 200

    @auth_required('token')
    @roles_accepted('spon','influ','admin')
    @marshal_with(payment_fields)
    def post(self):
        data = request.get_json()
        request_id = data.get('request')
        r = Request.query.filter_by(request_id=request_id).first()
        r.status = 1
        db.session.commit()
        c = Campaign.query.filter_by(campaignid = r.campaign_id).first()
        c.alloted = 1
        db.session.commit()
        k = Request.query.filter_by(status=0,campaign_id=r.campaign_id).all()
        for i in k:
            i.status = 3
            db.session.commit()

        new_payment = Payment(
            influencer_email=r.influencer_email,
            sponser_email=r.sponser_email,
            campaign_id=r.campaign_id,
            amount=r.payment_amount,
            status=0,
            campaign_name=r.campaign_name
        )
        db.session.add(new_payment)
        db.session.commit()
        return new_payment, 201

    @auth_required('token')
    @roles_accepted('spon','influ','admin')
    @marshal_with(payment_fields)
    def patch(self):
        data = request.get_json()
        payment_id = data.get('id')
        
        # Find the payment entry by id
        payment = Payment.query.filter_by(id=payment_id).first()

        if not payment:
            return {'message': 'Payment not found'}, 404

        # Set the status to 1
        payment.status = 1

        # Commit the change to the database
        db.session.commit()
        return payment, 200

    @auth_required('token')
    @roles_accepted('spon','influ','admin')
    def delete(self):
        data = request.get_json()
        payment = Payment.query.get(data['id'])
        if not payment:
            return {'message': 'Payment not found'}, 404
        
        db.session.delete(payment)
        db.session.commit()
        return {'message': 'Payment deleted'}, 200
    
    @auth_required('token')
    @roles_accepted('spon','influ','admin')
    @marshal_with(payment_fields)
    def put(self):
        data = request.get_json()
        email = data.get('email')
        role = data.get('role')
        if role == 'spon':
            payment = Payment.query.filter_by(sponser_email=email).all()
            return payment,200
        if role == 'influ':
            payment = Payment.query.filter_by(influencer_email=email).all()
            return payment,200

class RequestAPI(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    @cache.cached(timeout=100)
    @marshal_with(request_fields)
    def get(self):
        requests = Request.query.all()
        return requests, 200

    @auth_required('token')
    @roles_accepted('spon','influ','admin')
    @marshal_with(request_fields)
    def post(self):
        data = request.get_json()
        campaign = Campaign.query.filter_by(campaignid=data['campaign_id']).first()
        if not campaign:
            return {'message': 'Campaign not found'}, 404
        
        new_request = Request(
            influencer_email=data['influencer_email'],
            sponser_email=campaign.email,
            campaign_id=data['campaign_id'],
            campaign_name=campaign.campaignname,
            status=data['status'],
            payment_amount=campaign.budget,
            requirements=data['requirements'],
            messages=data['messages'],
            role=data['role'],
            category=campaign.category
        )
        db.session.add(new_request)
        db.session.commit()
        return new_request, 201

    @auth_required('token')
    @roles_accepted('spon','influ','admin')
    @marshal_with(request_fields)
    def patch(self):
        data = request.get_json()
        request_id = data.get('id')
        messages = data.get('messages')
        requirements = data.get('requirements')
        payment_amount	= data.get('payment_amount')
        request_record = Request.query.filter_by(request_id=request_id).first()
        if messages:
            request_record.messages = messages
            db.session.commit()
        if requirements:
            request_record.requirements = requirements
            db.session.commit()
        if payment_amount:
            request_record.payment_amount = payment_amount
            db.session.commit()
        return request_record, 200
    
    @auth_required('token')
    @roles_accepted('spon','influ','admin')
    def delete(self):
        data = request.get_json()
        request_record = Request.query.get(data['request_id'])
        if not request_record:
            return {'message': 'Request not found'}, 404
        
        db.session.delete(request_record)
        db.session.commit()
        return {'message': 'Request deleted'}, 200
    
    @auth_required('token')
    @roles_accepted('spon','influ','admin')
    @marshal_with(request_fields)
    def put(self):
        data = request.get_json()
        email = data.get('email')
        role = data.get('role')
        request_id = data.get('id')
        campaign_id = data.get('campaign_id')
        actions = data.get('actions')

        requests = []
        
        if role == 'spon':
            if actions:
                requests = Request.query.filter_by(sponser_email=email, role='influ').all()
                return requests, 200
            else:
                requests = Request.query.filter_by(sponser_email=email, role=role).all()
                return requests, 200
        elif role == 'influ':
            if actions:
                requests = Request.query.filter_by(influencer_email=email, role='spon').all()
                return requests, 200
            else: 
                requests = Request.query.filter_by(influencer_email=email, role=role).all()
            
                return requests, 200
        if request_id:
            request_record = Request.query.filter_by(request_id=request_id).first()
            if request_record:
                requests.append(request_record)
        if campaign_id:
            request_record = Request.query.filter_by(
                campaign_id=campaign_id,
                influencer_email=data['influencer_email']
            ).first()

            if request_record:
                return {"message": "request already exists"}, 400
            else:
                return "", 200
        if not requests:
            return {'message': 'No requests found'}, 404
        
        return requests, 200

class SponsorAPI(Resource):
    @auth_required('token')
    @roles_accepted('admin')
    @cache.cached(timeout=100)
    @marshal_with(sponsor_fields)
    def get(self):
        sponsors = Sponsor.query.all()
        return sponsors, 200

    @auth_required('token')
    @roles_accepted('spon')
    @marshal_with(sponsor_fields)
    def post(self):
        data = request.get_json()
        new_sponsor = Sponsor(
            email=data['email'],
            address=data['address'],
            contact=data['contact'],
            district=data['district'],
            state=data['state'],
            pincode=data['pincode'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            company_name=data['company_name'],
            industry=data['industry'],
            positions=data['positions'],
            bio=data['bio'],
            flag=0,
            wallet=0,
            approval=0
        )
        db.session.add(new_sponsor)
        db.session.commit()
        return new_sponsor, 201
    
    @auth_required('token')
    @roles_accepted('spon','admin')
    @marshal_with(sponsor_fields)
    def patch(self):
        data = request.get_json()
        sponsor = Sponsor.query.get(data['email'])
        if not sponsor:
            return {'message': 'Sponsor not found'}, 404
        campaigns = Campaign.query.filter_by(email = sponsor.email).all()

        for key, value in data.items():
            setattr(sponsor, key, value)
            if key == 'flag':
                if value ==1:
                    for campaign in campaigns:
                        campaign.flag = 1
                        requests = Request.query.filter_by(status=0, campaign_id=campaign.campaignid).all()
                        for request1 in requests:
                            request1.status = 6
                        db.session.commit()
                else:
                    for campaign in campaigns:
                        campaign.flag = 0
                        requests = Request.query.filter_by(status=6, campaign_id=campaign.campaignid).all()
                        for request1 in requests:
                            request1.status = 0
                        db.session.commit()
                    
                    db.session.commit()

        db.session.commit()
        return sponsor, 200
    
    @auth_required('token')
    @roles_accepted('spon','influ','admin')
    def delete(self):
        data = request.get_json()
        sponsor = Sponsor.query.get(data['email'])
        if not sponsor:
            return {'message': 'Sponsor not found'}, 404
        
        db.session.delete(sponsor)
        db.session.commit()
        return {'message': 'Sponsor deleted'}, 200
    
    @auth_required('token')
    @roles_accepted('spon','influ','admin')
    @marshal_with(sponsor_fields)
    def put(self):
        data = request.get_json()
    # Fetch sponsor by email, raise a 404 error if not found

        influencer = Sponsor.query.get(data['email'])
        if not influencer:
            return {'message': 'Influencer not found'}, 404
        
        
        # If influencer exists, get the sponsors associated with this email
        sponsors = Sponsor.query.filter_by(email=data['email']).all()
        return sponsors, 200


# Registering the resources
api.add_resource(PaymentAPI, '/payment')
api.add_resource(RequestAPI, '/request')
api.add_resource(SponsorAPI, '/sponsor')
# Register resources
api.add_resource(CampaignAPI, '/campaign')
api.add_resource(InfluencerAPI, '/influencer')

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

#celery demo 

@app.route('/celerydemo')
def celery_demo():
    task = add.delay(10,25)
    return jsonify({'task_id': task.id})

@app.route('/get-task/<task_id>')
def get_task(task_id):
    result = AsyncResult(task_id)

    if result.ready():
        return jsonify({'result': result.result}), 200

    else:

        return "task not ready", 405




@app.route('/oeanalytics/contract', methods=['POST'])
def download_sponser():
    data = request.json
    id = data.get('id')
    
    # Fetch the campaign, sponsor, and influencer records
    campaign = Campaign.query.filter_by(campaignid=id).first()
    r1 = Request.query.filter_by(campaign_id=id, status=1).first()
    sponsor = Sponsor.query.filter_by(email=r1.sponser_email).first()
    influencer = Influencer.query.filter_by(email=r1.influencer_email).first()

    # Convert to dictionary based on fields
    def model_to_dict(model, fields):
        return {key: getattr(model, key) for key in fields.keys()}
    
    campaign_dict = model_to_dict(campaign, campaign_fields)
    sponsor_dict = model_to_dict(sponsor, sponsor_fields)
    influencer_dict = model_to_dict(influencer, influencer_fields)

    # Start the Celery task with the dictionaries
    task = generate_pdf_task.delay(campaign_dict, sponsor_dict, influencer_dict)
    
    return jsonify({"task_id": task.id}), 202

@app.route('/oeanalytics/download/<task_id>')
def download_pdf(task_id):
    # Check task status
    task = generate_pdf_task.AsyncResult(task_id)
    if task.state == 'SUCCESS':
        pdf_file_path = task.result
        return send_file(pdf_file_path, as_attachment=True, download_name=os.path.basename(pdf_file_path))
    elif task.state == 'FAILURE':
        return jsonify({"error": "Failed to generate PDF"}), 500
    else:
        return jsonify({"status": task.state}), 202

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    emails = User.query.with_entities(User.email).filter(User.email != 'admin@iitm.ac.in').all()
    # Flatten list of tuples to a list of emails
    email_list = [email[0] for email in emails]
    # Calls test('hello') every 10 seconds.
    sender.add_periodic_task(10.0, daily_reminder.s(email_list, 'Testing', '<h2> content here </h2>'), name='add every 10')

    
    sender.add_periodic_task(
        crontab(hour=8, minute=0),
        daily_reminder.s(email_list, 'Daily Reminder', 'This is your daily reminder'),
        name='daily_notification'
    )


    influencers_with_pending_requests = (
        db.session.query(Influencer.email)
        .join(Request, Request.influencer_email == Influencer.email)
        .filter(Request.status == 0)  # Assuming 0 means pending
        .distinct()
        .all()
    )
    
    email_list = [inf.email for inf in influencers_with_pending_requests]
    sender.add_periodic_task(
        crontab(hour=18, minute=0),  # Daily at 6:00 PM
        send_daily_influencer_reminders.s(email_list),
        name='daily_influencer_reminder'
    )
    # Fetch sponsors with campaigns needing approval or other pending tasks
    sponsors_with_pending_campaigns = (
        db.session.query(Sponsor.email)
        .join(Campaign, Campaign.email == Sponsor.email)
        .filter(Campaign.approval == 0)  # Assuming 0 means pending approval
        .distinct()
        .all()
    )
    
    email_lists = [sponsor.email for sponsor in sponsors_with_pending_campaigns]
    sender.add_periodic_task(
        crontab(hour=18, minute=0),  # Daily at 6:00 PM
        send_daily_sponsor_reminders.s(email_lists),
        name='daily_influencer_reminder'
    )
    # Weekly notification every Monday at 9:00 AM
#    sender.add_periodic_task(
#        crontab(hour=9, minute=0, day_of_week=1),  # Monday
#        daily_reminder.s(email_list, 'Weekly Reminder', 'This is your weekly reminder'),
#        name='weekly_notification'
#    )


    # Fetch all influencers' emails
    influencers11 = db.session.query(Influencer.email).all()
    email_list11 = [influencer.email for influencer in influencers11]

    # Get the count of open and closed campaigns for the report
    open_campaigns_count = db.session.query(Campaign).filter(Campaign.alloted == 0).count()
    closed_campaigns_count = db.session.query(Campaign).filter(Campaign.alloted == 1).count()

    sender.add_periodic_task(
        crontab(hour=10, minute=0, day_of_month=1),
        send_monthly_influencer_report.s(open_campaigns_count,closed_campaigns_count,email_list11),
        name='monthly_notification'
    )

    # Monthly notification on the 1st day of the month at 10:00 AM
    sender.add_periodic_task(
        crontab(hour=10, minute=0, day_of_month=1),
        daily_reminder.s(email_list, 'Monthly Reminder', 'This is your monthly reminder'),
        name='monthly_notification'
    )

       # Quarterly notification on the 1st day of January, April, July, and October at 11:00 AM
    # sender.add_periodic_task(
    #     crontab(hour=11, minute=0, day_of_month=1, month_of_year='1,4,7,10'),
    #     daily_reminder.s(email_list, 'Quarterly Reminder', 'This is your quarterly reminder'),
    #     name='quarterly_notification'
    # )

    # Semi-annual notification on January 1st and July 1st at 12:00 PM
    # sender.add_periodic_task(
    #     crontab(hour=12, minute=0, day_of_month=1, month_of_year='1,7'),
    #     daily_reminder.s(email_list, 'Semi-Annual Reminder', 'This is your semi-annual reminder'),
    #     name='semiannual_notification'
    # )

    # Annual notification on January 1st at 1:00 PM
    # sender.add_periodic_task(
    #     crontab(hour=13, minute=0, day_of_month=1, month_of_year='1'),
    #     daily_reminder.s(email_list, 'Annual Reminder', 'This is your annual reminder'),
    #     name='annual_notification'
    # )



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
api.init_app(app)
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    celery_app = celery_init_app(app)
    app.run(debug=True)

#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>End<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
