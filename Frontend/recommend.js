// recommend.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const recommendationMessage = document.createElement('div');
    recommendationMessage.classList.add('recommendation-message');
    
    // Insert the message box after the form
    form.insertAdjacentElement('afterend', recommendationMessage);
    
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from reloading the page

        // Get the input values from the form
        const bookTitle = document.querySelector('input[name="book_title"]').value;
        const description = document.querySelector('input[name="description"]').value;

        // Show loading message while sending request
        recommendationMessage.textContent = "Submitting your recommendation...";
        recommendationMessage.classList.add('show');
        recommendationMessage.classList.remove('success', 'error');

        // Simulate a network request (Replace with actual fetch request if necessary)
        setTimeout(() => {
            // Show success message after submission
            recommendationMessage.textContent = `Your recommendation of the "${bookTitle}" book has been successfully submitted.`;
            recommendationMessage.classList.add('success');
            recommendationMessage.classList.remove('show');

            // Optionally, reset the form after submission
            form.reset();

            // Optionally, hide the message after a delay
            setTimeout(() => {
                recommendationMessage.classList.remove('success');
            }, 3000);  // Message fades out after 3 seconds
        }, 1500); // Simulate a delay for the "submission" (1.5 seconds)
    });
});
