from models import db, Author
from app import app, db

def main():
    with app.app_context():
        # Fetch all authors from the database
        authors = Author.query.all()
        for author in authors:
            print(f"ID: {author.id}")
            print(f"Name: {author.name}")
            print(f"Description: {author.description if hasattr(author, 'description') else 'N/A'}")
            print(f"Rate: {author.rate if hasattr(author, 'rate') else 'N/A'}")
            print("")  # Print a newline for better separation between entries

if __name__ == "__main__":
    main()

