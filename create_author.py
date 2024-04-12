from models import db, Author
from app import app

def main():
    with app.app_context():
        # Create author instances
        author1 = Author(name='Author 1', description='Description of Author 1', rate=4.5)
        author2 = Author(name='Author 2', description='Description of Author 2', rate=4.2)
        author3 = Author(name='Author 3', description='Description of Author 3', rate=4.0)

        # Add authors to the session
        db.session.add(author1)
        db.session.add(author2)
        db.session.add(author3)

        # Commit the session to save the changes to the database
        db.session.commit()
        print("Three example authors added successfully.")

if __name__ == "__main__":
    main()
