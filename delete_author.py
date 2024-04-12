from models import db, Author
from app import app

def main():
    with app.app_context():
        # Delete all authors
        authors = Author.query.all()
        for author in authors:
            db.session.delete(author)
        db.session.commit()
        print("All authors deleted successfully.")

if __name__ == "__main__":
    main()
