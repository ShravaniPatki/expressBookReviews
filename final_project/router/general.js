const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered"
    });
});


// Internal data route
public_users.get('/_data/books', (req, res) => {
    res.status(200).json(books);
});


// Get all books using Axios and async/await
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/_data/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve books"
        });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/_data/books');
        const isbn = req.params.isbn;

        if (!response.data[isbn]) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json(response.data[isbn]);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve book"
        });
    }
});


// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/_data/books');
        const author = req.params.author.toLowerCase();

        const result = Object.values(response.data).filter(book =>
            book.author.toLowerCase() === author
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve books"
        });
    }
});


// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/_data/books');
        const title = req.params.title.toLowerCase();

        const result = Object.values(response.data).filter(book =>
            book.title.toLowerCase() === title
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve books"
        });
    }
});


// Get book review
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/_data/books');
        const isbn = req.params.isbn;

        if (!response.data[isbn]) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json(response.data[isbn].reviews);
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve review"
        });
    }
});


module.exports.general = public_users;