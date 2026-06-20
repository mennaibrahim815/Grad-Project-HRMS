// const jwt = require("jsonwebtoken");

// require("dotenv").config(); 
// const SECRET_KEY = process.env.JWT_SECRET; 


// const verifyToken = (req, res, next) => {
//   // سحب التوكن من الهيدر (Authorization: Bearer <token>)
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(403).json({ message: "No token provided" });
//   }

//   jwt.verify(token, SECRET_KEY, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Unauthorized access" });
//     }
    
//     // حفظ الـ ID والبيانات المفكوكة في الـ req عشان نستخدمها في الـ Routes
//     req.userId = decoded.id;
//     req.userEmail = decoded.email;
//     req.userRole = decoded.role;
    
//     next(); // استكمال العملية للروت التالي
//   });
// };

// module.exports = verifyToken;




const jwt = require("jsonwebtoken");
require("dotenv").config(); // ✅ تحميل المتغيرات من .env

const SECRET_KEY = process.env.JWT_SECRET; // ✅ استخدام المتغير من .env

const verifyToken = (req, res, next) => {
  // سحب التوكن من الهيدر (Authorization: Bearer <token>)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    
    // حفظ الـ ID والبيانات المفكوكة في الـ req عشان نستخدمها في الـ Routes
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    
    next(); // استكمال العملية للروت التالي
  });
};

module.exports = verifyToken;