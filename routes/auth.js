const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
dotEnv.config();
const { User, validationLogin, validationRegister } = require("../models/User");

router.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const { error } = validationLogin({ email, password });
    if (error) {
      res.status(400);
      return next(new Error(error.details[0].message));
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      return next(new Error("Invalid email or password"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400);
      return next(new Error("Invalid email or password"));
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userObj = user.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    res.status(200).json({ ...userWithoutPassword, token });
  })
);

router.post(
  "/regester",
  asyncHandler(async (req, res, next) => {
    const { name, email, password, isAdmin } = req.body;

    const { error } = validationRegister({ name, email, password, isAdmin });
    if (error) {
      return next(new Error(error.details[0].message));
    }

    let checkUser = await User.findOne({ email });
    if (checkUser) {
      res.status(400);
      return next(new Error("This email already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword, isAdmin });
    const result = await user.save();

    const token = user.generateToken();

    const userObj = result.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    res.status(201).json({ ...userWithoutPassword, token });
  })
);
module.exports = router;
