document.addEventListener('DOMContentLoaded', () => {
    // Get all approve and decline buttons
    const approveButtons = document.querySelectorAll('.approve-btn');
    const declineButtons = document.querySelectorAll('.decline-btn');

    // Add event listeners to Accept and Decline buttons
    approveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr'); // Get the row the button is in
            const studentName = row.querySelector('td:nth-child(2)').textContent; // Get student name
            const bookName = row.querySelector('td:nth-child(1)').textContent; // Get book name
            const studentId = row.querySelector('td:nth-child(3)').textContent; // Get roll number

            // Send message to student about acceptance
            sendMessage(studentName, bookName, studentId, "Your recommendation request has been approved.");
            fadeOutAndRemoveRow(row); // Apply the fade-out animation and remove the row
        });
    });

    declineButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr'); // Get the row the button is in
            const studentName = row.querySelector('td:nth-child(2)').textContent; // Get student name
            const bookName = row.querySelector('td:nth-child(1)').textContent; // Get book name
            const studentId = row.querySelector('td:nth-child(3)').textContent; // Get roll number

            // Send message to student about decline
            sendMessage(studentName, bookName, studentId, "Your recommendation request has been declined.");
            fadeOutAndRemoveRow(row); // Apply the fade-out animation and remove the row
        });
    });

    // Function to apply fade-out animation and remove the row
    function fadeOutAndRemoveRow(row) {
        row.classList.add('fade-out'); // Add the fade-out class
        row.addEventListener('animationend', () => {
            row.remove(); // Remove the row after the animation ends
        });
    }

    // Function to send a message to the student
    async function sendMessage(studentName, bookName, studentId, message) {
        try {
            const response = await fetch('/sendMessage', {  // Make a POST request to the backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentName: studentName,
                    bookName: bookName,
                    studentId: studentId,
                    message: message,
                }),
            });

            if (response.ok) {
                console.log(`Message sent to ${studentName}`);
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
});
