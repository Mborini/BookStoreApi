const mongoose = require("mongoose");
const Joi = require("joi");
const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    minlength: 1,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    minlength: 1,
  },
  language: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    minlength: 1,
  },
});

const validation = (obj) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(500).trim().required(),
    description: Joi.string().min(1).max(500).trim().required(),
    language: Joi.string().min(1).max(500).trim().required(),
  });

  return schema.validate(obj);
};
const Book = mongoose.model("Book", BookSchema);
module.exports = { Book, validation };
