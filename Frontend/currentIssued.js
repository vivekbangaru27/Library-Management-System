document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-container input[type='text']");
    const tableBody = document.querySelector("table tbody");
    const noResultsRow = document.createElement("tr");
    noResultsRow.innerHTML = `<td colspan="5" style="text-align: center; color: gray;">No results found!</td>`;
    noResultsRow.style.display = "none"; // Initially hidden
    tableBody.appendChild(noResultsRow);

    // Function to fetch currently issued books (no token authentication)
    async function fetchCurrentlyIssuedBooks() {
        try {
            const response = await fetch('http://localhost:3000/current_issued_books', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch issued books');
            }

            const data = await response.json();

            if (data.books && data.books.length > 0) {
                tableBody.innerHTML = ''; // Clear the existing rows
                data.books.forEach(book => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${book.bookNumber}</td>
                        <td>${book.book_name}</td>
                        <td>${book.issueDate}</td>
                        <td>${book.dueDate}</td>
                        <td class="action-buttons">
                            <button class="btn-renew">Renew</button>
                            <button class="btn-return">Return</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
                noResultsRow.style.display = "none"; // Hide "No results found!" row
            } else {
                tableBody.innerHTML = ''; // Clear the table if no books are found
                noResultsRow.style.display = ""; // Show the "No results found!" row
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred while fetching issued books.');
        }
    }

    // Initial fetch of currently issued books
    fetchCurrentlyIssuedBooks();

    // Add an event listener to the search input for filtering
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const tableRows = document.querySelectorAll("table tbody tr");

        let hasResults = false;
        tableRows.forEach(row => {
            const cells = row.getElementsByTagName("td");
            const bookID = cells[0].textContent.toLowerCase();
            const bookName = cells[1].textContent.toLowerCase();

            if (bookID.includes(query) || bookName.includes(query)) {
                row.style.display = "";
                hasResults = true;
            } else {
                row.style.display = "none";
            }
        });

        noResultsRow.style.display = hasResults ? "none" : "";
    });
});
