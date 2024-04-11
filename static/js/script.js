async function updateUserWelcomeMessage() {
    const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const userData = await response.json();
        const userName = userData.name; // Assuming the user object has a 'name' property
        const welcomeMessageElement = document.getElementById('welcome-message');
        welcomeMessageElement.textContent = `Welcome, ${userName}!`;
    } else {
        const errorMessage = await response.text();
        console.error(`Failed to fetch user data: ${errorMessage}`);
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    if (response.status === 401) {
    alert("Invalid email or password");
}
    if (response.ok) {
        const data = await response.json();
        console.log(data); // Handle successful login
        updateUserWelcomeMessage();
        // Redirect to the received URL after successful login
        window.location.href = data.redirect_url;
    } else {
        const errorMessage = await response.text();
        alert(`Login failed: ${errorMessage}`);
    }
}

async function register(event) {
    event.preventDefault(); // Prevent the default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
        alert("All fields are required");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirm-password', confirmPassword);

    const response = await fetch('/register', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data); // Handle successful registration
	alert(data.msg);
	setTimeout(function() {
            window.location.href = '/api/login';
        }, 2000);
    } else {
        const errorMessage = await response.text();
        alert(`Registration failed: ${errorMessage}`);
    }
}


async function searchBooks() {
    const query = document.getElementById('search-query').value;

    const response = await fetch(`/api/books?query=${query}`);

    if (response.ok) {
        const data = await response.json();

        const bookResults = document.getElementById('book-results');
        bookResults.innerHTML = ''; // Clear previous results

        data.forEach(book => {
            const div = document.createElement('div');
            div.innerHTML = `<h3>${book.name}</h3><p>${book.author}</p>`;
            bookResults.appendChild(div);
        });
    } else {
        const errorMessage = await response.text();
        alert(`Search failed: ${errorMessage}`);
    }
}

// Function to display book detail
async function displayBookDetails(bookId) {
    const response = await fetch(`/api/book/${bookId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const bookDetails = await response.json();
        console.log(bookDetails); // Handle book details (e.g., update UI)
        // Example: Display book details in a modal
        alert(`Book Details:\nName: ${bookDetails.name}\nAuthor: ${bookDetails.author}`);
    } else {
        const errorMessage = await response.text();
        alert(`Failed to fetch book details: ${errorMessage}`);
    }
}

// Function to submit a review for a book
async function submitReview(bookId, reviewContent) {
    const token = localStorage.getItem('access_token'); // Assuming token is stored in localStorage after login

    const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ book_id: bookId, content: reviewContent })
    });

    if (response.ok) {
        alert('Review submitted successfully');
        // Optionally, update UI to reflect the new review
    } else {
        const errorMessage = await response.text();
        alert(`Failed to submit review: ${errorMessage}`);
    }
}

// JavaScript code for handling form submission to add a new book
async function addBook(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);

    // Make POST request to add a new book
    fetch('/admin/add_book', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Parse JSON response
        } else {
            throw new Error('Failed to add book'); // Throw error if response is not OK
        }
    })
    .then(data => {
        // Display success message to the user
        alert(data.message);
        // Optionally, you can redirect or perform other actions after adding the book
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add book');
    });
}

// Function to get reviews for a book
async function getReviews(event) {
    event.preventDefault();

    const bookId = document.getElementById('book_id').value;

    const response = await fetch(`/api/book/${bookId}/reviews`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const reviews = await response.json();
        // Handle reviews (e.g., update UI)
        console.log(reviews);
        // Display reviews in a new form
        const reviewList = document.getElementById('review-list');
        reviewList.innerHTML = ''; // Clear previous reviews
        reviews.forEach(review => {
            const div = document.createElement('div');
            div.innerHTML = `<p>Review ID: ${review.id}</p><p>Content: ${review.content}</p><p>User: ${review.user}</p>`;
            reviewList.appendChild(div);
        });
    } else {
        const errorMessage = await response.text();
        alert(`Failed to fetch reviews: ${errorMessage}`);
    }
}

// Function to add a review for a book
async function addReview(event) {
    event.preventDefault();

    const bookId = document.getElementById('book_id').value;
    const content = document.getElementById('content').value;

    const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ book_id: bookId, content: content })
    });

    if (response.ok) {
        alert('Review added successfully');
        // Optionally, update UI to reflect the new review
    } else {
        const errorMessage = await response.text();
        alert(`Failed to add review: ${errorMessage}`);
    }
}

// Function to delete a review
async function deleteReview(event) {
    event.preventDefault();

    const reviewId = document.getElementById('review_id').value;

    const response = await fetch(`/api/review/${reviewId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        alert('Review deleted successfully');
        // Optionally, update UI to reflect the deleted review
    } else {
        const errorMessage = await response.text();
        alert(`Failed to delete review: ${errorMessage}`);
    }
}

// Set event listeners for various actions
document.getElementById('search-books').addEventListener('click', searchBooks);
document.getElementById('get-reviews').addEventListener('click', getReviews);
document.getElementById('add-review').addEventListener('click', addReview);
document.getElementById('delete-review').addEventListener('click', deleteReview);

let token;

// Update event listeners
document.getElementById('search-book-form').addEventListener('submit', searchBooks);
document.getElementById('get-reviews-form').addEventListener('submit', getReviews);
document.getElementById('add-review-form').addEventListener('submit', addReview);
document.getElementById('delete-review-form').addEventListener('submit', deleteReview);
