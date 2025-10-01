document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.querySelector("#searchInput");
    const tableBody = document.querySelector("#booksTable tbody"); 

    // Create a "No results found!" row
    const noResultsRow = document.createElement("tr");
    noResultsRow.innerHTML = `<td colspan="5" style="text-align: center; color: gray;">No results found!</td>`;
    noResultsRow.style.display = "none"; 
    tableBody.appendChild(noResultsRow);

    try {
        // Fetch all books from the API
        const response = await fetch("http://localhost:3000/api/books");
        const books = await response.json();

        if (books.length === 0) {
            const noDataRow = `<tr><td colspan="5" style="text-align: center;">No books available</td></tr>`;
            tableBody.insertAdjacentHTML("beforeend", noDataRow);
        } else {
            books.forEach(book => {
                const availability = book.status === 1 ? "Available" : "Not Available";
                const availabilityClass = book.status === 1 ? "available" : "not-available";

                const rowHTML = `
                    <tr>
                        <td>${book.book_number}</td>
                        <td>${book.book_name}</td>
                        <td>${book.ISBN}</td>
                        <td class="${availabilityClass}">${availability}</td>
                        <td>
                            <button class="button details" data-book-id="${book.book_number}">Details</button>
                            <button class="button issue" data-book-id="${book.book_number}">Issue</button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML("beforeend", rowHTML);
            });
        }
    } catch (error) {
        console.error("Error loading books:", error);
    }

    // Search input functionality
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const tableRows = document.querySelectorAll("#booksTable tbody tr");
        let hasResults = false;

        tableRows.forEach(row => {
            const cells = row.getElementsByTagName("td");
            if (cells.length > 0) {
                const bookID = cells[0].textContent.toLowerCase();
                const bookName = cells[1].textContent.toLowerCase();
                const isbn = cells[2].textContent.toLowerCase();

                if (bookID.includes(query) || bookName.includes(query) || isbn.includes(query)) {
                    row.style.display = ""; 
                    hasResults = true;
                } else {
                    row.style.display = "none"; 
                }
            }
        });

        noResultsRow.style.display = hasResults ? "none" : "";
    });

    // Handle "Details" button click
    document.querySelector("#booksTable").addEventListener("click", async (event) => {
        if (event.target.classList.contains("details")) {
            const bookID = event.target.dataset.bookId;
            try {
                const response = await fetch(`http://localhost:3000/api/bookDetails/${bookID}`);
                if (!response.ok) throw new Error('Book details not found');
                const bookDetails = await response.json();

                document.getElementById("modalBookName").innerText = bookDetails.book_name;
                document.getElementById("modalISBN").innerText = bookDetails.ISBN;
                document.getElementById("modalAuthors").innerText = `${bookDetails.author1}, ${bookDetails.author2}`;
                document.getElementById("modalPublisher").innerText = bookDetails.publisher;
                document.getElementById("modalTags").innerText = bookDetails.tag;

                document.getElementById("bookDetailsModal").style.display = "block";
            } catch (error) {
                console.error("Error fetching book details:", error);
                alert("Could not fetch book details. Please try again.");
            }
        }

        // Handle "Issue" button click
        if (event.target.classList.contains("issue")) {
            const bookID = event.target.dataset.bookId;
            // You can add additional logic here to send the issue request to the server if needed
            alert(`Your issue request for Book ID: ${bookID} has been sent successfully.`);
        }
    });

    // Handle closing the modal
    document.getElementById("closeModal").addEventListener("click", () => {
        document.getElementById("bookDetailsModal").style.display = "none";
    });
});
