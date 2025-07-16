const router = require("express").Router();
const upload = require("../middlewares/upload");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// Routes avec middleware d'upload pour les images
router.post("/", isAuthenticated, isAdmin, upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", isAuthenticated, isAdmin, upload.single("image"), updateProduct);
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

module.exports = router;