const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
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
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
// Login endpoint
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  
      // Extract isbn parameter from request URL
    const isbn = req.params.isbn;
    let book = books[isbn];  // Retrieve book object associated with email

    if (book) {  // Check if book exists
        //let author = req.body.author;
            //let title = req.body.title;
            let reviews = req.body.reviews;

        /*Update if provided in request body
        if (title) {
            friend["title"] = title;
        }
        // Add similarly for firstName
        // Add similarly for lastName

                if (author) {
            friend["author"] = author;
        }*/
                if (reviews) {
            book["reviews"] = reviews;
        }


        books[isbn] = book;  // Update book details in 'books' object
        res.send(`Book with the isbn ${isbn} updated.`);
    } else {
        // Respond if friend with specified email is not found
        res.send("Unable to find book!");
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Extract email parameter from request URL
    const isbn = req.params.isbn;

    if (isbn) {
        delete books[isbn].reviews;
    }
    
    // Send response confirming deletion of friend
    res.send(`Book Review with the ISBN ${isbn} deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
