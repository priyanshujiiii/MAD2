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