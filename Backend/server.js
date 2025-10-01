require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const mysql = require("mysql2/promise");
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Adjust to your frontend's domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
const port = 3000;

// JWT Secret (move to .env in production)
// const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_key'; // Default if not set in .env

// Create a connection pool to the database
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "librarymanagement",
    port: 3306
});

// Check database connection
(async () => {
    try {
        const connection = await db.getConnection();
        console.log("Connected to the database successfully!");
        connection.release();
    } catch (err) {
        console.error("Failed to connect to the database:", err);
    }
})();

// Middleware to authenticate JWT token
// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         console.log('No token found');
//         return res.status(401).json({ error: 'Access denied, token missing!' });
//     }

//     jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) {
//             console.error('Token verification failed:', err.message);
//             return res.status(403).json({ error: 'Invalid token!' });
//         }
//         console.log('Token verified:', user);
//         req.user = user;
//         next();
//     });
// }


// Register Route
app.post('/register', (req, res) => {
    try {
        const { name, email, password, phone, rollNumber, department } = req.body;

        if (!name || !email || !password || !phone || !rollNumber || !department) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const programmeCode = rollNumber.charAt(0);
        const admissionYear = parseInt(rollNumber.slice(1, 3), 10) + 2000;
        const programme = programmeCode === 'B' ? 'B.Tech' : 'M.Tech';
        const validityYear = programme === 'B.Tech' ? admissionYear + 4 : admissionYear + 2;
        const validityDate = `${validityYear}-01-01`;

        const memberQuery = `INSERT INTO Member (userID, name, password, email, phone, dept) 
                             VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(memberQuery, [rollNumber, name, password, email, phone, department], (err) => {
            if (err) return res.status(500).json({ error: 'Error inserting into Member' });

            const studentQuery = `INSERT INTO Student (rollNo, validity, programme) VALUES (?, ?, ?)`;
            db.query(studentQuery, [rollNumber, validityDate, programme], (err) => {
                if (err) return res.status(500).json({ error: 'Error inserting into Student' });
                res.status(201).json({ message: 'Registration successful' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});

// Admin Login Route
app.post('/admin/login', async (req, res) => {
    const { employeeID, password } = req.body;

    if (!employeeID || !password) {
        return res.status(400).json({ error: 'Employee ID and password are required.' });
    }

    const query = 'SELECT * FROM Librarian WHERE employeeID = ? AND Password = ?';
    try {
        const connection = await db.getConnection();
        const [results] = await connection.query(query, [employeeID, password]);
        connection.release();

        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid Employee ID or Password.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Database error.' });
    }
});

// Member Login Route
app.post('/login', async (req, res) => {
    const { rollNumber, password } = req.body;

    if (!rollNumber || !password) {
        return res.status(400).json({ error: 'Roll number and password are required.' });
    }

    const query = 'SELECT * FROM Member WHERE userID = ? AND password = ?';
    try {
        const connection = await db.getConnection();
        const [results] = await connection.query(query, [rollNumber, password]);
        connection.release();

        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid Roll Number or Password.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Database error.' });
    }
});


// Serve static files (like the HTML pages)
app.use(express.static(path.join(__dirname)));





// Fetch all books
app.get("/api/books", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT b.book_number, bd.book_name, bd.ISBN, b.status 
            FROM book b 
            JOIN book_details bd ON b.ISBN = bd.ISBN
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Failed to fetch books" });
    }
});

// Fetch book details by bookID
app.get("/api/bookDetails/:bookID", async (req, res) => {
    const { bookID } = req.params;
    try {
        const [bookRows] = await db.query(`
            SELECT b.ISBN, bd.book_name, bd.publisher, bd.author1, bd.author2, bd.tag
            FROM Book_Details as bd
            JOIN Book as b ON bd.ISBN = b.ISBN
            WHERE b.book_number = ?
        `, [bookID]);

        if (bookRows.length > 0) {
            res.json(bookRows[0]);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error("Error fetching book details:", error);
        res.status(500).json({ message: "Could not fetch book details. Please try again." });
    }
});

// Add a new book
app.post('/api/addBook', async (req, res) => {
    const { title, author1, author2, publisher, date, tag, ISBN } = req.body;

    if (!title || !author1 || !author2 || !publisher || !date || !tag || !ISBN) {
        return res.status(400).json({ message: "Please fill out all fields." });
    }

    try {
        const [existingBook] = await db.query(`SELECT * FROM book WHERE ISBN = ?`, [ISBN]);
        
        if (existingBook.length > 0) {
            return res.status(400).json({ message: "Book with this ISBN already exists." });
        }

        const insertBookQuery = `INSERT INTO book (ISBN, status, adminID, arrival_date) VALUES (?, 1, ?, ?)`;
        const adminID = "ADMIN_12";  
        await db.query(insertBookQuery, [ISBN, adminID, date]);

        const insertBookDetailsQuery = `INSERT INTO book_details (ISBN, book_name, publisher, author1, author2, tag) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.query(insertBookDetailsQuery, [ISBN, title, publisher, author1, author2, tag]);

        return res.status(201).json({ message: 'Book added successfully!' });
    } catch (err) {
        console.error('Error inserting book:', err);
        return res.status(500).json({ message: 'Failed to add book to the database.' });
    }
});

// Fetch all issuance requests
app.get('/api/requests', async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT R.requestID, 
                   CASE R.type
                       WHEN 1 THEN 'Issuance'
                       WHEN 2 THEN 'Renewal'
                       WHEN 3 THEN 'Return'
                       ELSE 'Unknown'
                   END AS type,
                   M.userID AS rollNo, 
                   M.name AS studentName, 
                   R.book_name, 
                   DATE_FORMAT(R.req_date, '%Y-%m-%d') AS req_date
            FROM Request R
            JOIN Member M ON R.userID = M.userID
        `);

        if (results.length === 0) {
            return res.status(404).json({ error: 'No requests found.' });
        }

        res.json(results);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests.', details: error.message });
    }
});




// Handle request approval/rejection
app.post('/api/requests/:id', async (req, res) => {
    const requestID = req.params.id;
    const { action } = req.body;

    if (!requestID || !action) {
        return res.status(400).json({ success: false, message: 'Invalid request data' });
    }

    console.log(`Request ID: ${requestID}, Action: ${action}`);

    try {
        const [requestRows] = await db.query('SELECT * FROM Request WHERE requestID = ?', [requestID]);

        if (requestRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        const request = requestRows[0];

        if (action === "approved") {
            if (request.type === 1) { // Issuance request
                const [book] = await db.query(`
                    SELECT b.book_number 
                    FROM book b
                    JOIN book_details bd ON b.ISBN = bd.ISBN
                    WHERE bd.book_name = ? LIMIT 1
                `, [request.book_name]);
        
                console.log('Book query result:', book); // Debugging line
        
                // Check if book query returned a valid result
                if (!book || book.length === 0 || !book[0].book_number) {
                    return res.status(400).json({ 
                        success: false, 
                        message: `Book not found for issuance: ${request.book_name}` 
                    });
                }
        
                const bookNumber = book[0].book_number;
                const [lastIssue] = await db.query('SELECT MAX(CAST(issueID AS UNSIGNED)) AS lastIssue FROM borrowal');
                const newIssueNumber = (lastIssue?.[0]?.lastIssue || 0) + 1;
                const issueID = String(newIssueNumber).padStart(10, '0');
                const issueDate = new Date().toISOString().split('T')[0];
        
                await db.query(`
                    INSERT INTO borrowal (issueID, userID, bookNumber, issueDate)
                    VALUES (?, ?, ?, ?)
                `, [issueID, request.userID, bookNumber, issueDate]);
            } else if (request.type === 2) {
                console.log('Renewal logic here');
                // Add renewal logic if needed
            } else if (request.type === 3) {
                console.log('Return logic here');
                // Add return logic if needed
            }
        }

        // Delete request after action
        await db.query('DELETE FROM Request WHERE requestID = ?', [requestID]);
        const message = action === "approved"
            ? 'Request approved successfully.'
            : 'Request rejected successfully.';
        res.json({ success: true, message });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ success: false, message: 'Database query failed' });
    }
});

// Endpoint to get currently issued books for a member
app.get('/current_issued_books', async (req, res) => {
    const query = `
        SELECT bor.bookNumber, bor.issueDate, b.ISBN, bd.book_name
        FROM borrowal bor
        JOIN Book b ON bor.bookNumber = b.book_number
        JOIN Book_Details bd ON b.ISBN = bd.ISBN;
    `;

    try {
        const connection = await db.getConnection();
        const [results] = await connection.query(query);
        connection.release();

        if (results.length > 0) {
            // Calculate Due Date (2 months after issue date)
            results.forEach(book => {
                const issueDate = new Date(book.issueDate);
                const dueDate = new Date(issueDate.setMonth(issueDate.getMonth() + 2)); // Add 2 months
                book.dueDate = dueDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            });

            res.status(200).json({ books: results });
        } else {
            res.status(404).json({ message: 'No books currently issued.' });
        }
    } catch (err) {
        console.error('Error fetching currently issued books:', err);
        res.status(500).json({ error: 'Failed to fetch issued books.' });
    }
});







// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
