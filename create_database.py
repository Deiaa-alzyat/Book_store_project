from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# MySQL database connection URI
DATABASE_URI = 'mysql://username:password@localhost/library'

# SQLAlchemy engine
engine = create_engine(DATABASE_URI)

# Base class for declarative class definitions
Base = declarative_base()

# Define User model
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(100), nullable=False)

# Define Book model
class Book(Base):
    __tablename__ = 'books'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    author = Column(String(100), nullable=False)

# Create tables
def create_tables():
    Base.metadata.create_all(engine)

# Main function to execute
if __name__ == '__main__':
    create_tables()
    print("Database tables created successfully.")
