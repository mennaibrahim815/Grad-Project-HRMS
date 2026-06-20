const fs = require("fs");
const path = require("path");

// مسار ملف الداتابيز
const DB_PATH = path.join(__dirname, "../data/db.json");

/**
 * قراءة البيانات من db.json
 * @returns {Object} البيانات الكاملة
 */
const getDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Error reading database:", error);
    throw new Error("Failed to read database");
  }
};

/**
 * كتابة البيانات إلى db.json
 * @param {Object} data - البيانات المراد حفظها
 */
const saveDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
    console.log("✅ Database updated successfully");
  } catch (error) {
    console.error("❌ Error saving database:", error);
    throw new Error("Failed to save database");
  }
};

module.exports = { getDB, saveDB };