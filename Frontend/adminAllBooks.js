document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-bar input[type='text']");
    const bookTable = document.querySelector("#bookTable");
    const tableRows = bookTable.querySelectorAll("tr:not(:first-child)"); // Exclude the header row

    // Create a "No results found!" row
    const noResultsRow = document.createElement("tr");
    noResultsRow.innerHTML = `<td colspan="4" style="text-align: center; color: gray;">No results found!</td>`;
    noResultsRow.style.display = "none"; // Hide initially
    bookTable.appendChild(noResultsRow);

    // Fetch books from the backend
    const fetchBooks = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/books");
            const books = await response.json();

            // Clear previous rows (if any)
            bookTable.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());

            // Insert fetched books into the table
            books.forEach(book => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${book.book_number}</td>
                    <td>${book.book_name}</td>
                    <td>${book.ISBN}</td>
                    <td class="${book.status === 1 ? 'available' : 'not-available'}">
                        ${book.status === 1 ? 'Available' : 'Not Available'}
                    </td>
                `;
                bookTable.appendChild(row);
            });

            // Show or hide the "No results found!" row
            noResultsRow.style.display = books.length === 0 ? "" : "none";

        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    // Add event listener to the search input
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        let hasResults = false;

        tableRows.forEach(row => {
            const cells = row.getElementsByTagName("td");
            const bookID = cells[0].textContent.toLowerCase();
            const bookName = cells[1].textContent.toLowerCase();
            const isbn = cells[2].textContent.toLowerCase();

            // Check if the query matches Book ID, Book Name, or ISBN
            if (bookID.includes(query) || bookName.includes(query) || isbn.includes(query)) {
                row.style.display = ""; // Show the row if there's a match
                hasResults = true; // Set hasResults to true if there's at least one match
            } else {
                row.style.display = "none"; // Hide the row if there's no match
            }
        });

        // Show "No results found!" row if there are no matches
        noResultsRow.style.display = hasResults ? "none" : "";
    });

    // Call fetchBooks to populate the table when the page loads
    fetchBooks();
});
