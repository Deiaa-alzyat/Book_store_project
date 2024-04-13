from models import db, Review
from app import app

def main():
    with app.app_context():
        # Get the first 6 reviews
        reviews_to_delete = Review.query.limit(6).all()
        
        # Delete the selected reviews
        for review in reviews_to_delete:
            db.session.delete(review)
        
        db.session.commit()
        print("First 6 reviews deleted successfully.")

if __name__ == "__main__":
    main()
