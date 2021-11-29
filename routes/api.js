/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const Book = require("../model");
const mongoose = require("mongoose");
const ObjectID = require("bson-objectid");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
});

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, function (err, book) {
        if (err) {
          console.log(err);
        } else {
          return res.send(book);
        }
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title) {
        return res.send("missing required field title");
      }
      const userId = ObjectID();
      const newBook = new Book({
        title: title,
        _id: userId,
      });

      newBook.save(function (err, book) {
        if (err) {
          return console.log(err);
        } else {
          return res.json({
            title: book.title,
            _id: book._id,
          });
        }
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send("complete delete successful");
        }
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookId = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookId, function (err, book) {
        if (err) {
          console.log(err);
        } else if (book === null) {
          return res.send("no book exists");
        } else {
          return res.send(book);
        }
      });
    })

    .post(function (req, res) {
      let bookId = { _id: req.params.id };
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        return res.send("missing required field comment");
      }

      Book.findOneAndUpdate(
        bookId,
        { $addToSet: { comments: [comment] }, $inc: { commentcount: 1 } },
        { new: true },
        function (err, book) {
          if (book === null) {
            return res.send("no book exists");
          } else {
            return res.send(book);
          }
        }
      );
    })

    .delete(function (req, res) {
      let bookId = { _id: req.params.id };
      //if successful response will be 'delete successful'
      Book.deleteOne(bookId, function (err, deletedBook) {
        if (deletedBook.deletedCount === 0) {
          return res.send("no book exists");
        } else {
          return res.send("delete successful");
        }
      });
    });
};
