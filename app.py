from flask import Flask, request, jsonify
from models import db, User, Book, Author, Review
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

app.config['JWT_SECRET_KEY'] = 'Samir_Deiaa'
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

@app.before_first_request
def create_tables():
    db.create_all()

# To get book information
@app.route('/api/book/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = Book.query.get(book_id)
    if book:
        return jsonify({'name': book.name, 'description': book.description, 'type': book.type, 'rate': book.rate, 'author': book.author.name}), 200
    return jsonify({'message': 'Book not found'}), 404

@app.route('/api/register', methods=['POST'])
def register():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    # Simple validation
    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400
    # Check if user exists
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 409
    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User registered successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/api/books', methods=['GET'])
def search_books():
    query = request.args.get('query', '')
    books = Book.query.filter((Book.name.ilike(f'%{query}%')) | (Book.author.has(name.ilike(f'%{query}%')))).all()
    books_data = [{"id": book.id, "name": book.name, "author": book.author.name} for book in books]
    return jsonify(books_data), 200

@app.route('/api/reviews', methods=['POST'])
@jwt_required()
def add_review():
    user_email = get_jwt_identity()
    user = User.query.filter_by(email=user_email).first()
    book_id = request.json.get('book_id', None)
    content = request.json.get('content', '')
    if not book_id or not content:
        return jsonify({"msg": "Missing book ID or content"}), 400
    review = Review(content=content, user_id=user.id, book_id=book_id)
    db.session.add(review)
    db.session.commit()
    return jsonify({"msg": "Review added successfully"}), 201

@app.route('/api/book/<int:book_id>/reviews', methods=['GET'])
def get_reviews(book_id):
    reviews = Review.query.filter_by(book_id=book_id).all()
    reviews_data = [{"id": review.id, "content": review.content, "user": review.user.email} for review in reviews]
    return jsonify(reviews_data), 200

if __name__ == '__main__':
    app.run(debug=True)
