const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAAdmin,
} = require("../middlewares/verifyToken");
const dotEnv = require("dotenv");
dotEnv.config();
const {
  User,
  validationLogin,
  validationRegister,
  validationUpdate,
} = require("../models/User");
router.get(
  "/",
  verifyTokenAndAAdmin,
  asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
  })
);
router.get(
  "/:id",verifyTokenAndAuthorization,
  asyncHandler(async (req, res, next) => {
    const Id = req.params.id;
    const user = await User.findById(Id).select("-password");
    if (!user) {
      res.status(404);
      next(new Error("not found this user"));
    }
    res.status(200).json(user);
  })
);

router.put(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res, next) => {
    const Id = req.params.id;

    const { name, email, password } = req.body;
    console.log("token", req.headers.token);

    const { error } = validationUpdate({ name, email, password });
    if (error) {
      res.status(400);
      return next(new Error(error.details[0].message));
    }
    let checkUser = await User.findOne({ email });
    if (checkUser && checkUser._id.toString() !== Id) {
      res.status(400);
      return next(new Error("This email already exists"));
    }

    const updatedData = { name, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(Id, updatedData, {
      new: true,
    }).select("-password");

    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }

    res.status(200).json(user);
  })
);

router.delete(
  "/:id",verifyTokenAndAuthorization,
  asyncHandler(async (req, res, next) => {
    const Id = req.params.id;
    const user = await User.findByIdAndDelete(Id);
    if (!user) {
      res.status(404);
      next(new Error("not found this user"));
    }
    res.status(200).json({ message: "User deleted successfully" });
  })
);

module.exports = router;
