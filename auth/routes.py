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
@bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Debug: Print received form data
        print("Received form data:")
        print(request.form)

        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm-password')

        # Debug: Print extracted form data
        print("Extracted form data:")
        print("Name:", name)
        print("Email:", email)
        print("Password:", password)
        print("Confirm Password:", confirm_password)

        # Simple validation
        if not name or not email or not password or not confirm_password:
            return jsonify({"msg": "All fields are required"}), 400
        if password != confirm_password:
            return jsonify({"msg": "Passwords do not match"}), 400

        # Check if user exists
        if User.query.filter_by(email=email).first():
            return jsonify({"msg": "User already exists"}), 409

        # Create new user
        user = User(name=name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return jsonify({"msg": "User registered successfully"}), 201

    # If it's a GET request, render the register template
    return render_template('register.html')

@bp.route('/admin')
def admin():
    return render_template('admin.html')

@bp.route('/user')
def user():
    return render_template('user.html')

# Route for user login

def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            if email == 'eng.deiaa1111@gmail.com':  # Check if admin email
                access_token = create_access_token(identity=email)
                refresh_token = create_refresh_token(identity=email)
                return jsonify({
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "redirect_url": url_for('admin')
                }), 200
            else:
                access_token = create_access_token(identity=email)
                refresh_token = create_refresh_token(identity=email)
                return jsonify({
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "redirect_url": url_for('user')
                }), 200
        return jsonify({"msg": "Bad username or password"}), 401
    # If it's a GET request, render the login template
    return render_template('login.html')

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