-- Database and Table Creation
CREATE DATABASE LibraryManagement;
USE LibraryManagement;

-- Table for Librarian
CREATE TABLE Librarian (
    employeeID CHAR(8) PRIMARY KEY,
    Name VARCHAR(30),
    Password VARCHAR(25),
    Phone CHAR(10),
    Email VARCHAR(50)
);

-- Table for Member
CREATE TABLE Member (
    userID CHAR(9) PRIMARY KEY,
    name VARCHAR(35),
    password VARCHAR(25),
    email VARCHAR(45),
    phone CHAR(10),
    dept VARCHAR(10)
);

-- Table for Student (inherits Member)
CREATE TABLE Student (
    rollNo CHAR(9) PRIMARY KEY,
    validity DATE,
    programme VARCHAR(6),
    FOREIGN KEY (rollNo) REFERENCES Member(userID)
);

-- Table for Book
CREATE TABLE Book (
    book_number INT PRIMARY KEY,
    ISBN CHAR(13),
    status TINYINT(1),
    adminID CHAR(8),
    arrival_date DATE,
    FOREIGN KEY (adminID) REFERENCES Librarian(employeeID)
);

-- Table for Book Details with columns for authors and tags
CREATE TABLE Book_Details (
    ISBN CHAR(13) PRIMARY KEY,
    book_name VARCHAR(40),
    publisher VARCHAR(25),
    author1 VARCHAR(40),
    author2 VARCHAR(40),
    tag VARCHAR(20)
);

-- Table for Borrowal
CREATE TABLE Borrowal (
    issueID CHAR(10) PRIMARY KEY,
    userID CHAR(9),
    bookNumber INT,
    issueDate DATE,
    FOREIGN KEY (userID) REFERENCES Member(userID),
    FOREIGN KEY (bookNumber) REFERENCES Book(book_number)
);

-- Table for Request
CREATE TABLE Request (
    requestID CHAR(10) PRIMARY KEY,
    userID CHAR(9),
    book_name VARCHAR(40),
    req_date DATE,
    type TINYINT(1),
    FOREIGN KEY (userID) REFERENCES Member(userID)
);

-- Sample data for Librarians
INSERT INTO Librarian (employeeID, Name, Password, Phone, Email) 
VALUES 
('ADMIN_12345', 'Admin 1', 'hashed_password', '7203201356', 'admin1@nitc.ac.in'),
('ADMIN_67890', 'Admin 2', 'hashed_password', '7592069942', 'admin2@nitc.ac.in');

-- Sample data for Members (Students and Faculty)
INSERT INTO Member (userID, name, password, email, phone, dept) 
VALUES 
('B220056CS', 'Pranav Vaderiattil', 'hashed_password', 'pranav_b220056cs@nitc.ac.in', '8714739942', 'Computer Science'),
('B220035EE', 'Jovan Jacob', 'hashed_password', 'jovan_b220123ec@nitc.ac.in', '8234213532', 'Electrical and Electronics'),
('B220337CS', 'Mayank Jhawer', 'hashed_password', 'jhawer_b220337cs@nitc.ac.in', '0987654321', 'Computer Science');

-- Sample data for Students
INSERT INTO Student (rollNo, validity, programme) 
VALUES 
('B220056CS', '2028', 'BTech'),
('B220003CS', '2028', 'BTech'),
('B220020CS', '2028', 'BTech'),
('B220026EC', '2028', 'BTech'),
('B220030CS', '2028', 'BTech'),
('B220035EE', '2028', 'BTech'),
('B220036EE', '2028', 'BTech'),
('B220045CS', '2028', 'BTech'),
('B220078CS', '2028', 'BTech'),
('B220019CS', '2028', 'BTech'),
('B220055CS', '2028', 'BTech'),
('B220337CS', '2028', 'BTech'),
('B220359CS', '2028', 'BTech'),
('B221320CS', '2028', 'BTech'),
('B220057CS', '2028', 'BTech'),
('B210056ME', '2027', 'BTech'),
('B210003ME', '2027', 'BTech'),
('B210020ME', '2027', 'BTech'),
('B210026ME', '2027', 'BTech'),
('B210036ME', '2027', 'BTech'),
('B210045ME', '2027', 'BTech'),
('B210030ME', '2027', 'BTech'),
('M220056CS', '2026', 'MTech'),
('M220003CS', '2026', 'MTech'),
('M220020CS', '2026', 'MTech'),
('M220026CS', '2026', 'MTech');

-- Sample data for Book_Details with authors and tags
INSERT INTO Book_Details (ISBN, book_name, publisher, author1, author2, tag) 
VALUES 
('9780000000001', 'Theory of Computation', 'NIT Calicut', 'Michael Sipser', NULL, 'Education'),
('9780000000002', 'Database Management System', 'NIT Calicut', 'Ramez Elmasri', 'Shamkant Navathe', 'Education'),
('9780000000003', 'Intro to DBMS', 'IIT Delhi', 'Abraham Silberschatz', 'Henry Korth', 'Education'),
('9780000000004', 'Operating System', 'NIT Rourkela', 'Andrew S. Tanenbaum', NULL, 'Education'),
('9780000000005', 'Machine Learning and Algorithms', 'IIT Bombay', 'Tom M. Mitchell', 'Peter Norvig', 'Education'),
('9780000000006', 'OOPS', 'IIT Bombay', 'Bjarne Stroustrup', NULL, 'Education'),
('9780000000007', 'Number Theory and Cryptography', 'Pearsons', 'William Stallings', NULL, 'Education'),
('9780000000008', 'Image Processing', 'BITS Hyderabad', 'Rafael C. Gonzalez', 'Richard E. Woods', 'Education'),
('9780000000009', 'Introduction to Algorithms', 'MIT Press', 'Thomas H. Cormen', 'Charles E. Leiserson', 'Education'),
('9780000000010', 'Computer Networks', 'Pearsons', 'Andrew S. Tanenbaum', 'David J. Wetherall', 'Education'),
('9780000000011', 'Artificial Intelligence: A Modern Approach', 'Pearson', 'Stuart Russell', 'Peter Norvig', 'Education'),
('9780000000012', 'Data Structures and Algorithms in Java', 'McGraw-Hill', 'Robert Lafore', NULL, 'Education'),
('9780000000013', 'Python Programming: An Introduction to Computer Science', 'Franklin Associates', 'John Zelle', NULL, 'Programming'),
('9780000000014', 'Deep Learning', 'MIT Press', 'Ian Goodfellow', 'Yoshua Bengio', 'AI'),
('9780000000015', 'Charlie and the Chocolate Factory', 'Penguin Books', 'Roald Dahl', NULL, 'Fiction'),
('9780000000016', 'The Tale of Peter Rabbit', 'Frederick Warne & Co.', 'Beatrix Potter', NULL, 'Children');

-- Sample data for Book
INSERT INTO Book (book_number, ISBN, status, adminID, arrival_date) 
VALUES 
(1, '9780000000001', 1, 'ADMIN_12345', '2024-01-10'),
(2, '9780000000002', 1, 'ADMIN_12345', '2024-01-12'),
(3, '9780000000003', 0, 'ADMIN_67890', '2024-01-15'),
(4, '9780000000004', 1, 'ADMIN_67890', '2024-01-20'),
(5, '9780000000005', 1, 'ADMIN_12345', '2024-02-01'),
(6, '9780000000006', 1, 'ADMIN_12345', '2024-02-05'),
(7, '9780000000007', 1, 'ADMIN_67890', '2024-02-10'),
(8, '9780000000008', 1, 'ADMIN_67890', '2024-02-15'),
(9, '9780000000009', 0, 'ADMIN_12345', '2024-02-18'),
(10, '9780000000010', 1, 'ADMIN_12345', '2024-02-20'),
(11, '9780000000011', 1, 'ADMIN_67890', '2024-02-22'),
(12, '9780000000012', 1, 'ADMIN_67890', '2024-02-25'),
(13, '9780000000013', 0, 'ADMIN_12345', '2024-02-28'),
(14, '9780000000014', 0, 'ADMIN_12345', '2024-03-02'),
(15, '9780000000015', 1, 'ADMIN_67890', '2024-03-05'),
(16, '9780000000016', 1, 'ADMIN_67890', '2024-03-08');
