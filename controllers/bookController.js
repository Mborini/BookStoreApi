const asyncHandler = require("express-async-handler");
const express = require("express");
const { Book, validation } = require("../models/Books");

const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().populate("userId", "name email _id");
  res.status(200).json(books);
});

const getBookById = asyncHandler(async (req, res, next) => {
  const Id = req.params.id;
  const book = await Book.findById(Id); // fix: populate userId with name and email
  if (!book) {
    res.status(404);
    next(new Error("not found this book"));
  }
  res.status(200).json(book);
});

const createBook = asyncHandler(async (req, res, next) => {
    const { title, description, language, userId } = req.body; // fix: add userId to destructuring
    const { error } = validation({ title, description, language });
    if (error) {
      res.status(400);
      return next(new Error(error.details[0].message));
    }

    const newBook = new Book({
      title,
      description,
      language,
      userId, // ضروري تضيفه هون
    });

    const userExists = await User.findById(userId);
    if (!userExists) {
      res.status(400);
      return next(new Error("User not found"));
    }

    const result = await newBook.save();
    return res.status(201).json(result);
  });

  const updateBook = asyncHandler(async (req, res) => {
    const Id = req.params.id; // fix: use req.params.id

    const { title, description, language } = req.body;
    const { error } = validation({ title, description, language });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updateBook = await Book.findByIdAndUpdate(
      Id,
      { title, description, language },
      { new: true }
    );
    if (!updateBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(updateBook);
  });

const deleteBook = asyncHandler(async (req, res) => {
    const Id = req.params.id; // fix: remove parseInt
    const deletedBook = await Book.findByIdAndDelete(Id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted", deletedBook });
  });
module.exports = { getAllBooks, getBookById , createBook, updateBook, deleteBook };
