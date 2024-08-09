// models/Product.js
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  publish_date: { type: Date },
  price: { type: Number },
});

module.exports = mongoose.model('Book', BookSchema);
