from flask import Blueprint, request, jsonify, redirect, url_for,session,render_template
from models import db, User, Book, Author, Review
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from flask_bcrypt import Bcrypt

# Create a Blueprint for routes
bp = Blueprint('routes', __name__)

bcrypt = Bcrypt()

# Route to get book information
@bp.route('/api/book/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = Book.query.get(book_id)
    if book:
        return jsonify({'name': book.name, 'description': book.description, 'type': book.type, 'rate': book.rate, 'author': book.author.name}), 200
    return jsonify({'message': 'Book not found'}), 404

# Route for user registration
@bp.route('/api/register', methods=['POST'])
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

# Route for user login
@bp.route('/api/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=email)
        refresh_token = create_refresh_token(identity=email)
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    return jsonify({"msg": "Bad username or password"}), 401

# Route to search for books
@bp.route('/api/books', methods=['GET'])
def search_books():
    query = request.args.get('query', '')
    books = Book.query.filter((Book.name.ilike(f'%{query}%')) | (Book.author.has(name.ilike(f'%{query}%')))).all()
    books_data = [{"id": book.id, "name": book.name, "author": book.author.name} for book in books]
    return jsonify(books_data), 200

# Route to add a review for a book
@bp.route('/api/reviews', methods=['POST'])
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

# Route to get reviews for a book
@bp.route('/api/book/<int:book_id>/reviews', methods=['GET'])
def get_reviews(book_id):
    reviews = Review.query.filter_by(book_id=book_id).all()
    reviews_data = [{"id": review.id, "content": review.content, "user": review.user.email} for review in reviews]
    return jsonify(reviews_data), 200

# Logout route
@bp.route('/logout')
def logout():
    # Clear session
    session.clear()

    # Clear JWT cookies
    response = jsonify({"msg": "Logged out successfully"})
    unset_jwt_cookies(response)
    
    # Redirect to home page
    return redirect(url_for('routes.home'))

# Home route
@bp.route('/')
def home():
    return render_template('home.html')
