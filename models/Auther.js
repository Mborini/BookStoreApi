const Joi = require("joi");
const mongoose = require("mongoose");
const AuthorSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      minlength: 1,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      minlength: 1,
    },
    nationalty: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      minlength: 1,
    },
    image: {
      type: String,
      default: "dd.png",
      trim: true,
      maxlength: 200,
      minlength: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Validation function
const validation = (obj) => {
  const schema = Joi.object({
    FirstName: Joi.string().min(1).max(50).trim().required(),
    lastName: Joi.string().min(1).max(50).trim().required(),
    nationalty: Joi.string().min(1).max(50).trim().required(),
    image: Joi.string(),
  });

  return schema.validate(obj);
};

const Author = mongoose.model("Auther", AuthorSchema);
module.exports = { Author, validation };
