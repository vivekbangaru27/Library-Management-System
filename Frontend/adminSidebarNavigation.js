// Wait until the document is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Define URLs for each sidebar link
    const adminPageLinks = {
        home: 'admin_home.html',
        allBooks: 'admin_all_books.html',
        addBooks: 'admin_add_books.html',
        issueReturnRequests: 'admin_request.html',
        bookRecommendations: 'admin_recommendations.html',
        logout: '../index.html'
    };

    // Select all sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    // Add a click event listener to each sidebar link
    sidebarLinks.forEach((link) => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the default anchor behavior

            // Redirect based on the text of the link
            const linkText = link.textContent.trim();
            if (linkText.includes('Home')) {
                window.location.href = adminPageLinks.home;
            } else if (linkText.includes('All Books')) {
                window.location.href = adminPageLinks.allBooks;
            } else if (linkText.includes('Add Books')) {
                window.location.href = adminPageLinks.addBooks;
            } else if (linkText.includes('Requests')) {
                window.location.href = adminPageLinks.issueReturnRequests;
            } else if (linkText.includes('Book Recommendations')) {
                window.location.href = adminPageLinks.bookRecommendations;
            } else if (linkText.includes('Logout')) {
                window.location.href = adminPageLinks.logout;
            }
        });
    });
});
