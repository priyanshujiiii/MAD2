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
from flask_restful import Resource,Api, reqparse, marshal_with, fields

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

class Influencer(db.Model):
    __tablename__ = 'influencer'
    
    email = db.Column(db.String, primary_key=True)
    password = db.Column(db.String, nullable=False)
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
    password = db.Column(db.String, nullable=False)
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
    @marshal_with(CategoryResources)
    def get(self):
        category = Category.query.all()
        return category
    
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
    
    @marshal_with(CategoryResourcess)
    def put(self):
        result = (
            db.session.query(
                Category.category,
                func.count(Campaign.campaignid).label("count")
            )
            .outerjoin(Campaign, (Category.category == Campaign.category) & (Campaign.alloted == 0))
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
    'payment': fields.Integer
}

influencer_fields = {
    'email': fields.String,
    'password': fields.String,
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
    'password': fields.String,
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
    'wallet': fields.Integer
}

# API Resources

class CampaignAPI(Resource):
    @marshal_with(campaign_fields)
    def get(self):
        campaigns = Campaign.query.all()
        return campaigns, 200

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
            payment=data['payment']
        )
        db.session.add(new_campaign)
        db.session.commit()
        return new_campaign, 201

    @marshal_with(campaign_fields)
    def patch(self):
        data = request.get_json()
        campaign = Campaign.query.get(data['campaignid'])
        if not campaign:
            return {'message': 'Campaign not found'}, 404

        for key, value in data.items():
            setattr(campaign, key, value)

        db.session.commit()
        return campaign, 200

    def delete(self):
        data = request.get_json()
        campaign = Campaign.query.get(data['campaignid'])
        if not campaign:
            return {'message': 'Campaign not found'}, 404
        
        db.session.delete(campaign)
        db.session.commit()
        return {'message': 'Campaign deleted'}, 200
    
    @marshal_with(campaign_fields)
    def put(self):
        data = request.get_json()
        desired_category = data.get('category')

        # Filter campaigns based on the specified conditions
        campaigns = Campaign.query.filter_by(
            category=desired_category,
            alloted=0,  # Corrected spelling
            visibility='Public'  # Assuming visibility is case-sensitive
        ).all()
        return campaigns, 200


class InfluencerAPI(Resource):
    @marshal_with(influencer_fields)
    def get(self):
        influencers = Influencer.query.all()
        return influencers, 200

    @marshal_with(influencer_fields)
    def post(self):
        data = request.get_json()
        new_influencer = Influencer(
            email=data['email'],
            password=data['password'],
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

    @marshal_with(influencer_fields)
    def patch(self):
        data = request.get_json()
        influencer = Influencer.query.get(data['email'])
        if not influencer:
            return {'message': 'Influencer not found'}, 404

        for key, value in data.items():
            setattr(influencer, key, value)

        db.session.commit()
        return influencer, 200

    def delete(self):
        data = request.get_json()
        influencer = Influencer.query.get(data['email'])
        if not influencer:
            return {'message': 'Influencer not found'}, 404
        
        db.session.delete(influencer)
        db.session.commit()
        return {'message': 'Influencer deleted'}, 200
    
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
    @marshal_with(payment_fields)
    def get(self):
        payments = Payment.query.all()
        return payments, 200

    @marshal_with(payment_fields)
    def post(self):
        data = request.get_json()
        new_payment = Payment(
            influencer_email=data['influencer_email'],
            sponser_email=data['sponser_email'],
            campaign_id=data['campaign_id'],
            amount=data['amount'],
            status=data['status'],
            campaign_name=data['campaign_name']
        )
        db.session.add(new_payment)
        db.session.commit()
        return new_payment, 201

    @marshal_with(payment_fields)
    def patch(self):
        data = request.get_json()
        payment = Payment.query.get(data['id'])
        if not payment:
            return {'message': 'Payment not found'}, 404

        for key, value in data.items():
            setattr(payment, key, value)

        db.session.commit()
        return payment, 200

    def delete(self):
        data = request.get_json()
        payment = Payment.query.get(data['id'])
        if not payment:
            return {'message': 'Payment not found'}, 404
        
        db.session.delete(payment)
        db.session.commit()
        return {'message': 'Payment deleted'}, 200

class RequestAPI(Resource):
    @marshal_with(request_fields)
    def get(self):
        requests = Request.query.all()
        return requests, 200

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

    @marshal_with(request_fields)
    def patch(self):
        data = request.get_json()
        request_id = data.get('request_id')
        request_record = Request.query.filter_by(request_id=request_id).first()
        if not request_record:
            return {'message': 'Request not found'}, 404

        for key, value in data.items():
            if  key != 'request_id':
                setattr(request_record, key, value)

        db.session.commit()
        return request_record, 200

    def delete(self):
        data = request.get_json()
        request_record = Request.query.get(data['request_id'])
        if not request_record:
            return {'message': 'Request not found'}, 404
        
        db.session.delete(request_record)
        db.session.commit()
        return {'message': 'Request deleted'}, 200
    
    @marshal_with(request_fields)
    def put(self):
        data = request.get_json()
        email = data.get('email')
        role = data.get('role')
        request_id = data.get('id')
        campaign_id = data.get('campaign_id')

        requests = []
        
        if role == 'spon':
            requests = Request.query.filter_by(sponser_email=email, role=role).all()
        elif role == 'influ':
            requests = Request.query.filter_by(influencer_email=email, role=role).all()
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
    @marshal_with(sponsor_fields)
    def get(self):
        sponsors = Sponsor.query.all()
        return sponsors, 200

    @marshal_with(sponsor_fields)
    def post(self):
        data = request.get_json()
        new_sponsor = Sponsor(
            email=data['email'],
            password=data['password'],
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
            flag=10,
            wallet=0
        )
        db.session.add(new_sponsor)
        db.session.commit()
        return new_sponsor, 201

    @marshal_with(sponsor_fields)
    def patch(self):
        data = request.get_json()
        sponsor = Sponsor.query.get(data['email'])
        if not sponsor:
            return {'message': 'Sponsor not found'}, 404

        for key, value in data.items():
            setattr(sponsor, key, value)

        db.session.commit()
        return sponsor, 200

    def delete(self):
        data = request.get_json()
        sponsor = Sponsor.query.get(data['email'])
        if not sponsor:
            return {'message': 'Sponsor not found'}, 404
        
        db.session.delete(sponsor)
        db.session.commit()
        return {'message': 'Sponsor deleted'}, 200
    
    @marshal_with(sponsor_fields)
    def put(self):
        data = request.get_json() 
        if data['email'] and Sponsor.query.get(data['email']):
            {'message': 'Sponsor not found'}, 404
        if data['email']:
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
    app.run(debug=True)

#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>End<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
#>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<#
