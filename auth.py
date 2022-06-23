from flask_restx import Resource,Namespace,fields
from models import User,YearsOfStudy
from flask_jwt_extended import (JWTManager,
create_access_token,create_refresh_token,
get_jwt_identity,
jwt_required)
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask,request,jsonify,make_response

auth_ns = Namespace('auth', description="A namespace for our authentication")


#Model (serializer) - i.e. gets our model into json format
signup_model = auth_ns.model(
    'SignUp',
    {
        "forename": fields.String(),
        "surname": fields.String(),
        "username": fields.String(),
        "email": fields.String(),
        "password": fields.String(),
        "subject": fields.String(),
        "numberOfYears": fields.Integer()
    }
)

login_model = auth_ns.model(
    'Login',
    {
        "username": fields.String(),
        "password": fields.String()
    }
)

@auth_ns.route('/SignUp')
class SignUp(Resource):

    @auth_ns.expect(signup_model)
    def post(self):
        data=request.get_json()

        #Check if username already exists
        username=data.get('username')
        db_user=User.query.filter_by(username=username).first()
        if db_user is not None:
            return jsonify({"message":"username already exists"})

        #Check if email already exists
        email=data.get('email')
        db_email=User.query.filter_by(email=email).first()
        if db_email is not None:
            return jsonify({"message":"email already used"})

        new_user=User(
            forename = data.get('forename'),
            surname = data.get('surname'),
            username = data.get('username'),
            email = data.get('email'),
            password = generate_password_hash(data.get('password')),
            numberOfYears = data.get('numberOfYears'),
            subject = data.get('subject')
        )

        new_user.save()

        """ADD YEARS - add 4 to be safe"""
        user=User.query.filter_by(username=data.get('username')).first()
        user_id = user.id
        """
        if user.numberOfYears>=4:
            years = 4
        else:
            years = 3
        """
        years=4
        i = 0
        while i<years:

            new_year = YearsOfStudy(
                yearNumber = (i+1),
                student_ID = user_id
            )
            new_year.add()
            i+=1

        return make_response(jsonify({"message":"User created successfuly"}),201)

@auth_ns.route('/login')
class Login(Resource):
    
    @auth_ns.expect(login_model)
    def post(self):
        data=request.get_json()

        username=data.get('username')
        password=data.get('password')

        db_user=User.query.filter_by(username=username).first()

        if db_user and check_password_hash(db_user.password, password):

            access_token=create_access_token(identity=db_user.username)
            refresh_token=create_refresh_token(identity=db_user.username)

            return jsonify({"access_token":access_token,"refresh_token":refresh_token})
        else:
            return jsonify({"message":"Invalid username or password"})


@auth_ns.route('/checkPassword')
class Login(Resource):
    
    def put(self):
        data=request.get_json()

        username=data.get('current_username')
        password=data.get('current_password')

        db_user=User.query.filter_by(username=username).first()

        if db_user and check_password_hash(db_user.password, password):
            return jsonify({"message":1})
        else:
            return jsonify({"message":0})


@auth_ns.route('/refresh')
class RefreshResource(Resource):
    @jwt_required(refresh=True)
    def post(self):

        current_user=get_jwt_identity()

        new_access_token=create_access_token(identity=current_user)

        return make_response(jsonify({"access_token":new_access_token}),200)
    