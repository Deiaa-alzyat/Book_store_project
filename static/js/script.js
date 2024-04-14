async function updateUserWelcomeMessage() {
    try {
        const response = await fetch('/api/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Include the JWT token in the request headers if available
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            const userName = userData.name; // Accessing user's name from the response
            const welcomeMessageElement = document.getElementById('welcome-message');
            welcomeMessageElement.textContent = `Welcome, ${userName}!`;
        } else {
            throw new Error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Error:', error);
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
    } else if(response.ok) {
        const data = await response.json();
        console.log(data);
	const { access_token, redirect_url } = data;
        localStorage.setItem('access_token', access_token);
        await updateUserWelcomeMessage(access_token);
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

async function searchBooks(event) {
    event.preventDefault(); // Prevent form submission

    const query = document.getElementById('search-query').value;
    console.log('Search Query:', query); // Debugging

    const response = await fetch(`/api/books?query=${query}`);
    console.log('Search Response:', response); // Debugging

    if (response.ok) {
        const data = await response.json();
        console.log('Search Results:', data); // Debugging

        const bookResults = document.getElementById('book-results');
        bookResults.innerHTML = ''; // Clear previous results
	if (data.length === 0) {
            bookResults.textContent = 'No Book or Author found match your search';
        } else {
            data.forEach(book => {
                const div = document.createElement('div');
                div.innerHTML = `
			<h3>${book.name}</h3>
			<p>Description: ${book.description}</p>
                        <p>Type: ${book.type}</p>
                        <p>Rate: ${book.rate}</p>
			<p>Author: ${book.author}</p>`;
                bookResults.appendChild(div);
            });
	}
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

async function addReview(event) {
    event.preventDefault();

    const bookIdInput = document.getElementById('book_id');
    const contentInput = document.getElementById('content');
    const statusDiv = document.getElementById('add-review-status');
    const submitButton = event.target.querySelector('button[type="submit"]');

    submitButton.disabled = true;  // Disable the submit button to prevent multiple submissions

    const bookId = bookIdInput.value;
    const content = contentInput.value;
    const token = localStorage.getItem('access_token');

    if (!token) {
        statusDiv.innerHTML = 'Authentication token missing. Please log in again.';
        submitButton.disabled = false;
        return;
    }

    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ book_id: bookId, content: content })
        });

        console.log('Add Review Response:', response); // Debugging

        const responseData = await response.json();
        console.log('Response Data:', responseData); // Debugging

        if (response.ok) {
            statusDiv.innerHTML = 'Review added successfully';
            bookIdInput.value = '';
            contentInput.value = '';
        } else {
            statusDiv.innerHTML = responseData.message || 'Failed to add review. Please try again.';
            submitButton.disabled = false;  // Re-enable the submit button on failure
        }
    } catch (error) {
        console.error('Error:', error);
        statusDiv.innerHTML = `Failed to add review: ${error.message}`;
        submitButton.disabled = false;
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

async function addAuthor(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch('/admin/add_author', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to add author');
        }
    })
    .then(data => {
	document.getElementById('author-status').textContent = data.message;
        document.getElementById('author-status').style.color = 'green'; // success message in green
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('author-status').textContent = 'Failed to add author';
        document.getElementById('author-status').style.color = 'red'; // error message in red
    });
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
	document.getElementById('book-status').textContent = data.message;
        document.getElementById('book-status').style.color = 'green'; // success message in green
    })
    .catch(error => {
        console.error('Error:', error);
	document.getElementById('book-status').textContent = 'Failed to add book';
        document.getElementById('book-status').style.color = 'red'; // error message in red
    });
}

async function getReviews(event) {
    event.preventDefault(); // Prevent form submission

    const bookId = document.getElementById('bookid').value;
    console.log('Book ID:', bookId); // Debugging

    try {
        const response = await fetch(`/api/book/${bookId}/reviews`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Get Reviews Response:', response); // Debugging

        if (response.ok) {
            const reviews = await response.json();
            console.log('Reviews:', reviews); // Debugging

            const reviewList = document.getElementById('get-reviews-results');
            reviewList.innerHTML = ''; // Clear previous reviews

            if (reviews.length === 0) {
                reviewList.textContent = 'No reviews found for this book.';
            } else {
                const ul = document.createElement('ul');
                reviews.forEach(review => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <p>Review ID: ${review.id}</p>
                        <p>Content: ${review.content}</p>
                        <p>User: ${review.user}</p>`; // Assuming 'user' is the user's email
                    ul.appendChild(li);
                });
                reviewList.appendChild(ul);
            }
        } else {
            throw new Error('Failed to fetch reviews');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Failed to fetch reviews: ${error.message}`);
    }
}


async function deleteReview(event) {
    event.preventDefault(); // Prevent form submission

    const reviewId = document.getElementById('review_id').value; // Fetch the review ID from input
    console.log('Review ID:', reviewId); // Debugging log

    try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Delete Review Response:', response); // Debugging response status

        // Target the status div to update with the result
        const deleteStatusDiv = document.getElementById('delete-review-status');

        if (response.ok) {
            deleteStatusDiv.textContent = 'Review deleted successfully.';
            deleteStatusDiv.style.color = 'green'; // Sets text color to green on successful deletion
        } else if (response.status === 404) {
            deleteStatusDiv.textContent = 'Review not found.';
            deleteStatusDiv.style.color = 'red'; // Sets text color to red if not found
        } else {
            throw new Error('Failed to delete review'); // Handle other errors
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('delete-review-status').textContent = `Failed to delete review: ${error.message}`;
        document.getElementById('delete-review-status').style.color = 'red'; // Error text in red
    }
}


// Set event listeners for various action
//console.log(document.getElementById('search-books'));
//document.getElementById('search-books').addEventListener('click', searchBooks);
//document.getElementById('get-reviews').addEventListener('click', getReviews);
//document.getElementById('add-review').addEventListener('click', addReview);
//document.getElementById('delete-review').addEventListener('click', deleteReview);

let token;

// Update event listeners
//document.getElementById('search-book-form').addEventListener('submit', searchBooks);
//document.getElementById('get-reviews-form').addEventListener('submit', getReviews);
//document.getElementById('add-review-form').addEventListener('submit', addReview);
//document.getElementById('delete-review-form').addEventListener('submit', deleteReview);

updateUserWelcomeMessage();
