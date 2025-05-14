const express = require("express");
const router = express.Router();
const { Author, validation } = require("../models/Auther");
const asyncHandler = require("express-async-handler");
const { verifyTokenAndAAdmin } = require("../middlewares/verifyToken");
const {
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  createAuthor,
  deleteAuthor,
} = require("../controllers/authorController");

// router.get("/", getAllAuthors);

// router.get("/:id", getAuthorById);

// router.post("/", verifyTokenAndAAdmin, createAuthor);

// router.put("/:id", verifyTokenAndAAdmin, updateAuthor);

// router.delete("/:id", verifyTokenAndAAdmin, deleteAuthor);

router.route("/").get(getAllAuthors).post(verifyTokenAndAAdmin, createAuthor);
router
  .route("/:id")
  .get(getAuthorById)
  .put(verifyTokenAndAAdmin, updateAuthor)
  .delete(verifyTokenAndAAdmin, deleteAuthor);

module.exports = router;
