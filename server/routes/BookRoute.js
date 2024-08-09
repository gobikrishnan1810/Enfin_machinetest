// routes/products.js
const express = require('express');
const Book = require('../model/Bookmodel');
const router = express.Router();
const { body, validationResult } = require('express-validator');


const validateBook = [
    body('name').isString().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('description').isString().isLength({ min: 3 }).withMessage('Description must be at least 3 characters long'),
    body('publish_date').optional().isDate().withMessage('Publish date must be in Date format'),
    body('price').optional().isNumeric({ min: 0 }).withMessage('price must be a non-negative integer')
  ];
  
  const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };

// GET /products?page=1&limit=10&search=query
router.get('/getbooks', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const books = await Book.find({
      name: { $regex: search, $options: 'i' } // Case-insensitive search
    })
    .skip(parseInt(skip))
    .limit(parseInt(limit));

    const totalBooks = await Book.countDocuments({
      name: { $regex: search, $options: 'i' }
    });

    res.json({
      books,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/insert-book', validateBook, handleValidationErrors, async (req, res) => {
    try {
      const { name, description, publish_date, price } = req.body;
      console.log('req',req.body);
      const newBook = new Book({ name, description, publish_date, price });
      await newBook.save();
      res.status(201).json({ message: 'Book added successfully', book: newBook });
    
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

module.exports = router;
