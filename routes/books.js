const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// POST /api/books
router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, price, quantity } = req.body;

    // Custom Validation
    const errors = {};

    if (!title || title.trim().length < 3 || title.trim().length > 200) {
      errors.title = "Title must be between 3 and 200 characters.";
    }
    if (!author || author.trim().length === 0) {
      errors.author = "Author is required.";
    }
    if (!isbn || isbn.trim().length === 0) {
      errors.isbn = "ISBN is required.";
    }
    if (price === undefined || price < 0) {
      errors.price = "Price must be a non-negative number.";
    }
    if (quantity !== undefined && quantity < 0) {
      errors.quantity = "Quantity cannot be less than 0.";
    }

    // If there are validation errors, return 400
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors
      });
    }

    // Create a new book instance
    const newBook = new Book({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      price,
      quantity
    });

    // Save to database
    const savedBook = await newBook.save();

    // Success response
    res.status(201).json({
      success: true,
      message: "Book successfully created",
      savedBook
    });

  } catch (error) {
    // Handling Duplicate ISBN Error (code 11000)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Conflict: Book with this ISBN already exists",
        field: "isbn"
      });
    }

    // Handling Mongoose ValidationError
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors
      });
    }

    // Handling other errors
    console.error("Error creating book:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

module.exports = router;
