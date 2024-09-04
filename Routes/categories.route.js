const router = require("express").Router();
const {
  createCategory,
  getAllCategories,
} = require("../controller/category.controller");

// Create category ---->
router.post("/", createCategory);

// Get all categories ---->
router.get("/", getAllCategories);

module.exports = router;
