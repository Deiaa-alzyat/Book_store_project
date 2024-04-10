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
