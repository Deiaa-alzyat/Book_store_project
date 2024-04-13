from models import db, User
from app import app

def main():
    with app.app_context():
        users = User.query.all()  # Example query to fetch all users
        for user in users:
            print(f"ID: {user.id}")
            print(f"Name: {user.name}")
            print(f"Email: {user.email}")
            # Print any additional attributes as needed
            print("")


if __name__ == "__main__":
    main()
