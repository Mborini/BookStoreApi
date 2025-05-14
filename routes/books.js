const express = require("express");
const router = express.Router();
const { verifyTokenAndAAdmin } = require("../middlewares/verifyToken");
const {
  getAllBooks,
  getBookById,
  deleteBook,
  updateBook,
  createBook,
} = require("../controllers/bookController");

// router.get("/", getAllBooks);

// router.get("/:id", getBookById);

// router.post("/", verifyTokenAndAAdmin, createBook);

// router.put("/:id", verifyTokenAndAAdmin, updateBook);

// router.delete("/:id", verifyTokenAndAAdmin, deleteBook);

router.route("/").get(getAllBooks).post(verifyTokenAndAAdmin, createBook);

router
  .route("/:id")
  .get(getBookById)
  .put(verifyTokenAndAAdmin, updateBook)
  .delete(verifyTokenAndAAdmin, deleteBook);

module.exports = router;
