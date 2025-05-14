const express = require("express");
const { Author, validation } = require("../models/Auther");
const asyncHandler = require("express-async-handler");
const { verifyTokenAndAAdmin } = require("../middlewares/verifyToken");

const getAllAuthors = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // رقم الصفحة من المستخدم أو 1 افتراضيًا
  const limit = 5; // عدد العناصر ثابت

  const skip = (page - 1) * limit;

  const authorList = await Author.find().skip(skip).limit(limit);

  const totalAuthors = await Author.countDocuments();
  const totalPages = Math.ceil(totalAuthors / limit);

  res.json({
    page,
    totalPages,
    totalAuthors,
    limit,
    data: authorList,
  });
});

const getAuthorById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const author = await Author.findById(id);
  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  res.send(author);
});

const createAuthor = asyncHandler(async (req, res) => {
  const FirstName = req.body?.FirstName;
  const lastName = req.body?.lastName;
  const nationalty = req.body?.nationalty;
  const image = req.body?.image;
  const { error } = validation({ FirstName, lastName, image, nationalty });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newAuthor = new Author({ FirstName, lastName, image, nationalty });
  const result = await newAuthor.save();
  return res.status(201).json(result);
});

const updateAuthor = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const FirstName = req.body?.FirstName;
  const lastName = req.body?.lastName;
  const nationalty = req.body?.nationalty;
  const image = req.body?.image;
  const { error } = validation({ FirstName, lastName, image, nationalty });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      input: error.details[0].context?.value,
    });
  }

  const updatedAuthor = await Author.findByIdAndUpdate(
    id,
    { FirstName, lastName, image, nationalty },
    { new: true }
  );

  if (!updatedAuthor) {
    return res.status(404).json({ message: "Author not found" });
  }

  return res.status(200).json(updatedAuthor);
});

const deleteAuthor =  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const author = await Author.findByIdAndDelete(id);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.status(200).json({ message: "Author deleted", author });
  });

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor,deleteAuthor };
