from flask import Flask, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from models import db
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_login import LoginManager, login_user, logout_user

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'Samir_Deiaa'
app.config['SECRET_KEY'] = 'your_secret_key'

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)

# Models
from models import User, Book, Author, Review

# Create database tables
with app.app_context():
    db.create_all()

# Register blueprints
from auth.routes import bp
app.register_blueprint(bp)

# Login manager setup
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():
    return redirect(url_for('bp.login'))

# Logout route
@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))

# Home route
@app.route('/')
def home():
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
