from flask_restx import Namespace,Resource,fields
from models import User,YearsOfStudy
from flask_jwt_extended import jwt_required
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash


user_ns=Namespace('user',description="A namespace for User Account")

user_model = user_ns.model(
    'User',
    {
        "id":fields.Integer(),
        "forename": fields.String(),
        "surname": fields.String(),
        "username": fields.String(),
        "email": fields.String(),
        "password": fields.String(),
        "subject": fields.String(),
        "numberOfYears": fields.Integer(),
        #"years": fields.String()
    }
)

year_model = user_ns.model(
    'YearsOfStudy',
    {
        "id":fields.Integer(),
        "yearNumber": fields.Integer(),
        "student_ID": fields.Integer(),
    }
)


@user_ns.route('/users')
class UsersResource(Resource):

    @user_ns.marshal_list_with(user_model)
    def get(self):
        """Get all Users """

        users=User.query.all()

        return users
    
@user_ns.route('/getUser/<string:username>')
class UsersResource(Resource):

    @user_ns.marshal_list_with(user_model)
    def get(self,username):
        """Get id of a user with a specific username """

        user=User.query.filter_by(username=username).first()
        

        return user


@user_ns.route('/user/<int:id>')
class UsersResource(Resource):

    @user_ns.marshal_with(user_model)
    def get(self,id):
        """Get a user by id """
        user=User.query.get_or_404(id)

        return user


    @jwt_required()
    def put(self,id):
        """Update a user by id """
        
        user_to_update=User.query.get_or_404(id)

        data=request.get_json()

        #Check if username already exists
        username=data.get('username')
        if user_to_update.username!=username:
            db_user=User.query.filter_by(username=username).first()
            if db_user is not None:
                return jsonify({"message":"username already exists"})

        #Check if email already exists
        email=data.get('email')
        if user_to_update.email!=email:
            db_email=User.query.filter_by(email=email).first()
            if db_email is not None:
                return jsonify({"message":"email already used"})

        user_to_update.update(id,data.get('forename'),data.get('surname'),data.get('username'),data.get('email'),generate_password_hash(data.get('password')),data.get('subject'),data.get('numberOfYears'))

        return jsonify({"message":"User updated succesfully"})

    #@user_ns.marshal_with(user_model)
    @jwt_required()
    def delete(self,id):
        """Delete a user by id """
        
        """First delete assignments->modules->years, then user"""
        user_to_delete=User.query.get_or_404(id)
        for year in user_to_delete.years:
            for module in year.modules:
                for assignment in module.work:
                    assignment.delete()
                module.delete()
            year.delete()

        """Delete user """
        user_to_delete=User.query.get_or_404(id)
        user_to_delete.delete()

        return jsonify({"message":"User deleted"})