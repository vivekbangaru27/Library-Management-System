
// Wait until the document is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get references to the form elements
    const signInButton = document.querySelector('.form-section button');
    const signUpButton = document.querySelector('.form-section:last-child .button');
    
    // Function to show alert messages
    function showAlert(message) {
        alert(message);
    }

    // Sign In button click event
    signInButton.addEventListener('click', function (event) {
        // Prevent default form submission
        event.preventDefault();
    
        // Get input values
        const rollNo = document.querySelector('.form-section input[placeholder="Roll No"]').value;
        const password = document.querySelector('.form-section input[placeholder="Password"]').value;
    
        // Simple validation
        if (!rollNo || !password) {
            showAlert('Please enter both Roll No and Password to sign in.');
        } else {
            // Placeholder for sign-in functionality (add API call or form submit here)
            showAlert('Signing in...');
        }
    
        // Send POST request to the login endpoint
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userID: rollNo, password: password })
        })
        .then(response => {
            if (response.ok) {
                // Redirect to /home after successful login
                window.location.href = '/home';  // Redirect to the home page
            } else if (response.status === 401) {
                throw new Error('Invalid credentials');
            } else {
                throw new Error('An error occurred');
            }
        })
        .catch(error => {
            // Show error message to the user
            showAlert(error.message);
        });
    });
    

    signUpButton.addEventListener('click', function (event) {
        // Prevent default form submission
        event.preventDefault();
    
        // Get input values
        const name = document.querySelector('.form-section:last-child input[placeholder="Name"]').value;
        const email = document.querySelector('.form-section:last-child input[placeholder="Email"]').value;
        const password = document.querySelector('.form-section:last-child input[placeholder="Password"]').value;
        const phone = document.querySelector('.form-section:last-child input[placeholder="Phone Number"]').value;
        const rollNumber = document.querySelector('.form-section:last-child input[placeholder="Roll Number"]').value;
        const department = document.querySelector('.form-section:last-child select').value;
    
        // Validate all fields are filled
        if (!name || !email || !password || !phone || !rollNumber || !department) {
            showAlert('Please fill out all fields to sign up.');
            return;
        }
    
        // Validate email format
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
            showAlert('Please enter a valid email address.');
            return;
        }
    
        // Validate password length
        if (password.length < 6) {
            showAlert('Password should be at least 6 characters long.');
            return;
        }
    
        // Send POST request to the backend to register the user
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: rollNumber,  // Assuming rollNumber is the userID
                name,
                password,
                email,
                phone,
                dept: department
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Registration successful') {
                showAlert('Registration successful! You can now log in.');
                // Redirect to login or home page
                window.location.href = '/login'; // Or whatever route you want to redirect to
            } else {
                showAlert('Registration failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Something went wrong, please try again later.');
        });
    });    
    
});
