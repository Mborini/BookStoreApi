const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      minlength: 1,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      minlength: 1,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      minlength: 1,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const validationRegister = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(500).trim().required(),
    email: Joi.string().min(1).max(500).trim().required(),
    password: Joi.string().min(1).max(500).trim().required(),
    
  });

  return schema.validate(obj);
};

const validationLogin = (obj) => {
  const schema = Joi.object({
    email: Joi.string().min(1).max(500).trim().required(),
    password: Joi.string().min(1).max(500).trim().required(),
  });

  return schema.validate(obj);
};
const validationUpdate = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(500).trim(),
    email: Joi.string().min(1).max(500).trim(),
    password: Joi.string().min(1).max(500).trim(),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(obj);
};
UserSchema.method.generateToken = function () {
  return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

}

const User = mongoose.model("User", UserSchema);
module.exports = { User, validationRegister, validationLogin, validationUpdate };