from flask import Flask, request, jsonify,make_response
from flask_sqlalchemy  import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_restx import Api, Resource, fields
from config import DevConfig,ProdConfig
from models import User, YearsOfStudy
from exts import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token,jwt_required
from flask_cors import CORS

from auth import(auth_ns)
from account import(user_ns)
from grades import(grades_ns)

app = Flask(__name__)
app.config.from_object(ProdConfig)
db.init_app(app)
migrate = Migrate(app, db)
JWTManager(app)

CORS(app)

api = Api(app,doc='/docs')
api.add_namespace(auth_ns)
api.add_namespace(user_ns)
api.add_namespace(grades_ns)

@api.route('/hello')
class HelloResource(Resource):
    def get(self):
        return {'message':'Hello World'}

@app.shell_context_processor
def make_shell_context():
    return {
        "db":db,
        "User": User,
        "YearsOfStudy": YearsOfStudy
    }

if __name__ == '__main__':
    app.run(debug=True)
    