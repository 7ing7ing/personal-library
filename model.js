const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: { type: String, required: true },
  _id: String,
  comments: { type: Array, default: [] },
  commentcount: { type: Number, default: 0 },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
