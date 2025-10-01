// Wait until the document is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Define the target URLs for each sidebar link
    const pageLinks = {
        home: 'home.html',
        messages: 'messages.html',
        allBooks: 'all_books.html',
        recommendBooks: 'recommend.html',
        issuedBooks: 'current_issued.html',
        logout: '../index.html'
    };

    // Get all sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    // Add click event listener to each link
    sidebarLinks.forEach((link, index) => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default link behavior

            // Redirect based on the link text content
            const linkText = link.textContent.trim();
            if (linkText.includes('Home')) {
                window.location.href = pageLinks.home;
            } else if (linkText.includes('Messages')) {
                window.location.href = pageLinks.messages;
            } else if (linkText.includes('All Books')) {
                window.location.href = pageLinks.allBooks;
            } else if (linkText.includes('Recommend Books')) {
                window.location.href = pageLinks.recommendBooks;
            } else if (linkText.includes('Currently Issued Books')) {
                window.location.href = pageLinks.issuedBooks;
            } else if (linkText.includes('Logout')) {
                window.location.href = pageLinks.logout;
            }
        });
    });
});
