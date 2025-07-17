const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Non autorisé" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Erreur de vérification du token:", err);
    return res.status(401).json({ msg: "Token invalide" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ msg: "Accès réservé à l'admin" });
  next();
};


