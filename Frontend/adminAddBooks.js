document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addBookForm");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const title = document.getElementById("bookTitle").value;
      const author1 = document.getElementById("author1").value;
      const author2 = document.getElementById("author2").value;
      const publisher = document.getElementById("publisher").value;
      const date = document.getElementById("arrivalDate").value;
      const tag = document.getElementById("tag").value;
      const ISBN = document.getElementById("ISBN").value;
  
      const bookData = {
        title,
        author1,
        author2,
        publisher,
        date,
        tag,
        ISBN,
      };
  
      if (!title || !author1 || !author2 || !publisher || !date || !tag || !ISBN) {
        errorMessage.textContent = "Please fill out all fields.";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
        return;
      }
  
      successMessage.style.display = "none";
      errorMessage.style.display = "none";
  
      console.log("Sending request with data:", JSON.stringify(bookData, null, 2)); // Enhanced Logging
  
        try {
        const response = await fetch("http://localhost:3000/api/addBook", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
    });
  
        console.log("Response:", response); // Check response status
  
        if (response.ok) {
          const responseData = await response.json();
          console.log("Success:", responseData);
          successMessage.textContent = responseData.message || "Book added successfully!";
          successMessage.style.display = "block";
        } else {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          errorMessage.textContent = errorData.message || "An error occurred while adding the book.";
          errorMessage.style.display = "block";
        }
      } catch (error) {
        console.error("Error:", error);
        errorMessage.textContent = "An error occurred while adding the book.";
        errorMessage.style.display = "block";
      }
    });
  });
  