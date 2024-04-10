from app import app, db
from models import Book  # Import the Book model

def main():
    with app.app_context():
        # Add your database operations here
        books = Book.query.all()  # Example query to fetch all books
        for book in books:
            print(f"Book ID: {book.id}, Name: {book.name}, Description: {book.description}")

if __name__ == "__main__":
    main()

