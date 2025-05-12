const connectToDatabase = require("../config/db"); // استيراد دالة الاتصال بقاعدة البيانات  

async function databaseMiddleware(req, res, next) {
  try {
    await connectToDatabase();  // حاول الاتصال بقاعدة البيانات
    next();  // إذا كانت متصلة، تابع الطلب
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to DB", error: error.message });
  }
}

module.exports = databaseMiddleware;
