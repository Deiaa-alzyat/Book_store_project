from models import db, Book, Author
from app import app

def main():
    with app.app_context():
        # Add three example books
        book1 = Book(name="Introduction to Python", description="A beginner's guide to Python programming", type="Tutorial", rate=4.5)
        book2 = Book(name="The Great Gatsby", description="A classic novel by F. Scott Fitzgerald", type="Fiction", rate=4.8)
        book3 = Book(name="The Catcher in the Rye", description="A coming-of-age novel by J.D. Salinger", type="Fiction", rate=4.7)

        # Retrieve an existing author or create a new one
        author = Author.query.filter_by(name="John Doe").first()
        if not author:
            author = Author(name="John Doe", description="Unknown author", rate=4.0)
            db.session.add(author)
            db.session.commit()

        # Associate the books with the author
        book1.author = author
        book2.author = author
        book3.author = author

        # Add the books to the database
        db.session.add_all([book1, book2, book3])
        db.session.commit()

        print("Three example books added successfully.")

if __name__ == "__main__":
    main()
