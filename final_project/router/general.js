const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


/*Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}*/

//Using Promise

// Get the book list available in the shop using Promise callbacks
public_users.get('/promise', function (req, res) {
  axios.get('http://localhost:5000/') //the server runs locally
    .then(response => {
      res.status(200).send(response.data); // Send the books data as the response
    })
    .catch(error => {
      res.status(500).send("Error fetching the book list");
    });
});


// Get book details based on ISBN using Promise callbacks
public_users.get('/promise/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Extract the ISBN from request parameters

  axios.get(`http://localhost:5000/isbn/${isbn}`) //server runs locally
    .then(response => {
      res.status(200).send(response.data); // Send the book details as the response
    })
    .catch(error => {
      res.status(500).send("Error fetching book details by ISBN");
    });
});



// Endpoint to get book details based on Author using Promise callbacks
public_users.get('/author/promise/:author', (req, res) => {
    const author = req.params.author;

    axios.get('http://localhost:3000/') // Fetch the full list of books
        .then(response => {
            const allBooks = response.data;
            const matchingBooks = [];

            // Filter books based on author
            for (const isbn in allBooks) {
                if (allBooks[isbn].author.toLowerCase() === author.toLowerCase()) {
                    matchingBooks.push(allBooks[isbn]);
                }
            }

            if (matchingBooks.length > 0) {
                res.status(200).send(matchingBooks); // Return matching books
            } else {
                res.status(404).send(`No books found for author: ${author}`);
            }
        })
        .catch(error => {
            res.status(500).send("Error fetching books data.");
        });
});


// Endpoint to get book details based on Title using Promise callbacks
public_users.get('/title/promise/:title', (req, res) => {
    const title = req.params.title;

    axios.get('http://localhost:3000/') // Fetch the full list of books
        .then(response => {
            const allBooks = response.data;
            const matchingBooks = [];

            // Filter books based on title
            for (const isbn in allBooks) {
                if (allBooks[isbn].title.toLowerCase() === title.toLowerCase()) {
                    matchingBooks.push(allBooks[isbn]);
                }
            }

            if (matchingBooks.length > 0) {
                res.status(200).send(matchingBooks); // Return matching books
            } else {
                res.status(404).send(`No books found with title: ${title}`);
            }
        })
        .catch(error => {
            res.status(500).send("Error fetching books data.");
        });
});





public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

    const author = req.params.author;
    const matchingBooks = [];

    for (const isbn in books) {
        if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push(books[isbn]);
        }
    }

    res.send(matchingBooks);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = [];

  for (const isbn in books) {
      if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
          matchingBooks.push(books[isbn]);
      }
  }

  res.send(matchingBooks);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
