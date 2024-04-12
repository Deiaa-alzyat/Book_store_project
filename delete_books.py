from models import db, Book
from app import app

def main():
    with app.app_context():
        # Delete all books
        books = Book.query.all()
        for book in books:
            db.session.delete(book)
        db.session.commit()
        print("All books deleted successfully.")

if __name__ == "__main__":
    main()
