from models import db, Book, Author
from app import app, db 

# Assuming you have already set up your database connection

def main():
    with app.app_context():
        # Add your database operations here
        books = Book.query.all()  # Example query to fetch all books
        for book in books:
            print(f"ID: {book.id}")
            print(f"Name: {book.name}")
            print(f"Description: {book.description}")
            print(f"Type: {book.type}")
            print(f"Rate: {book.rate}")
            print(f"Author: {book.author.name}")
            print("")


if __name__ == "__main__":
    main()

