const mongoose = require("mongoose");

async function connectToDatabase() {
  return await mongoose.connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((error) => {
      console.log("Cannot connect to DB", error);
      throw error;  // رمي الخطأ ليتم التعامل معه في مكان آخر (الميدل وير)
    });
}

module.exports = connectToDatabase;