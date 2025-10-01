document.addEventListener("DOMContentLoaded", function () {
    const signInButton = document.querySelector('#signInButton');
    const signUpButton = document.querySelector('.form-section:last-child .button');

    // Function to show alert messages
    function showAlert(message) {
        alert(message);
    }

    // Sign In button click event
    signInButton.addEventListener('click', function (event) {
        event.preventDefault();
    
        const rollOrEmployeeID = document.querySelector('#rollOrEmployeeID').value;
        const password = document.querySelector('#password').value;
    
        if (!rollOrEmployeeID || !password) {
            showAlert('Please enter both Roll No or Employee ID and Password to sign in.');
            return;
        }
    
        let url;
        let payload = { password };  // Common password for both logins
    
        if (rollOrEmployeeID.length === 8) {
            url = 'http://localhost:3000/admin/login'; // Admin login route
            payload.employeeID = rollOrEmployeeID;     // Use employeeID for admin
        } else {
            url = 'http://localhost:3000/login';       // Member login route
            payload.rollNumber = rollOrEmployeeID;     // Use rollNumber for member
        }
    
        console.log(`Sending login request to: ${url}`);
        console.log('Payload:', payload);
    
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
    
            if (data.message === 'Login successful') {
                window.location.href = url.includes('admin') 
                    ? './admin/admin_home.html' 
                    : './student/home.html';
            } else {
                showAlert('Invalid credentials, please try again.');
            }
        })
        .catch(err => {
            console.error('Fetch error:', err);
            showAlert('An error occurred. Please try again.');
        });
    });

    // Sign Up button click event
    signUpButton.addEventListener('click', function (event) {
        event.preventDefault();

        const name = document.querySelector('.form-section:last-child input[placeholder="Name"]').value;
        const email = document.querySelector('.form-section:last-child input[placeholder="Email"]').value;
        const password = document.querySelector('.form-section:last-child input[placeholder="Password"]').value;
        const phone = document.querySelector('.form-section:last-child input[placeholder="Phone Number"]').value;
        const rollNumber = document.querySelector('.form-section:last-child input[placeholder="Roll Number"]').value;
        const department = document.querySelector('.form-section:last-child select').value;

        if (!name || !email || !password || !phone || !rollNumber || !department) {
            showAlert('Please fill out all fields to sign up.');
            return;
        }

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, phone, rollNumber, department }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Registration successful') {
                showAlert('Registration successful! Redirecting to login...');
                window.location.href = './index.html'; // Redirect to the login page
            } else {
                showAlert('Error during registration.');
            }
        })
        .catch(() => {
            showAlert('An error occurred. Please try again.');
        });
    });
});
