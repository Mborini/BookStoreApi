const express = require("express");
const bookPath = require("./routes/books");
const autherPath = require("./routes/authers");
const userPath = require("./routes/users");
const authPath = require("./routes/auth");
const databaseMiddleware = require("./middlewares/databaseMiddleware");

const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");
const mongoose = require("mongoose");
const dotEnv = require("dotenv").config();;

// إعداد تطبيق Express
const app = express();


app.use(databaseMiddleware);

// إعداد Middleware
app.use(express.json());

app.use(logger);

// تطبيق الـ Routes
app.use("/api/books", bookPath);
app.use("/api/authers", autherPath);
app.use("/api/auth", authPath);
app.use("/api/users", userPath);

//middelware error handling
app.use(notFound)
app.use(errorHandler)
// بدء الخادم
app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
