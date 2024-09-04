const router = require("express").Router();
const {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getAllBlogs,
} = require("../controller/blog.controller");

// Create new blog ---->
router.post("/create", createBlog);

// Update blog ---->
router.put("/:id", updateBlog);

// Delete blog ---->
router.delete("/:id", deleteBlog);

// Get blog by Id ---->
router.get("/:id", getBlogById);

// Get all blogs ---->
router.get("/", getAllBlogs);

module.exports = router;
