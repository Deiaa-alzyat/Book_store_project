from app import app, db
from models import User

# Function to delete all users
def delete_all_users():
    with app.app_context():
        # Delete all users from the database
        User.query.delete()

        # Commit the changes
        db.session.commit()

# Run the function to delete all users
if __name__ == '__main__':
    delete_all_users()
    print("All users deleted successfully!")
