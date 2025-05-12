const express = require("express");
const router = express.Router();
const { Author, validation } = require("../models/Auther");
const asyncHandler = require("express-async-handler");
const { verifyTokenAndAAdmin } = require("../middlewares/verifyToken");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const authorList = await Author.find();
    res.send(authorList);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.send(author);
  })
);

router.post(
  "/",
  verifyTokenAndAAdmin,
  asyncHandler(async (req, res) => {
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
  })
);

router.put(
  "/:id",
  verifyTokenAndAAdmin,
  asyncHandler(async (req, res) => {
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
  })
);

router.delete(
  "/:id",
  verifyTokenAndAAdmin,
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const author = await Author.findByIdAndDelete(id);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.status(200).json({ message: "Author deleted", author });
  })
);

module.exports = router;
