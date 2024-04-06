from flask import Flask
from routes import bp as routes_bp
from models import db

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Register the routes Blueprint
app.register_blueprint(routes_bp)

if __name__ == '__main__':
    app.run(debug=True)
