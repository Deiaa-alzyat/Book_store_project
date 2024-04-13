from models import db, Review
from app import app

def main():
    print("Starting main function...")
    with app.app_context():
        reviews = Review.query.all()
        print(f"Number of reviews: {len(reviews)}")
        for review in reviews:
            print(f"ID: {review.id}")
            print(f"Content: {review.content}")
            print(f"User ID: {review.user_id}")
            print(f"Book ID: {review.book_id}")
            print("")
    print("Main function finished.")

if __name__ == "__main__":
    main()
