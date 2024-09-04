const db = require("../config/firebaseConfig");
const { v4: uuidv4 } = require("uuid");
const { route } = require("../Routes/blog.route");
const blogCollection = db.collection("blogs");

// CREATE BLOG ---->
const createBlog = async (req, res) => {
  try {
    const id = uuidv4();
    const blogRef = blogCollection.doc(id);
    const query = blogCollection.where("title", "==", req.body.title);
    const blog = await query.get();
    if (blog.empty) {
      const newBlog = {
        email: req.body.email,
        title: req.body.title,
        description: req.body.description,
        photo: req.body.photo,
        category: req.body.category,
        createdAt: new Date(),
      };
      blogRef.set(newBlog).then(() => {
        res.status(201).json({
          success: true,
          message: "New blog is created successfully !!",
          blogId: id,
          blogDetails: newBlog,
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Blog already exists, Please try something else !!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something broke in the server !!",
      error: error.message,
    });
  }
};

// UPDATE BLOG --->
const updateBlog = async (req, res) => {
  try {
    const blogRef = blogCollection.doc(req.params.id);
    const blog = await blogRef.get();
    if (!blog.exists) {
      res.status(404).json({
        success: false,
        message: "Blog not found !!",
      });
    } else {
      if (blog.data().email === req.body.email) {
        blogRef
          .update({
            title: req.body.title,
            description: req.body.description,
            updatedAt: new Date(),
          })
          .then(async () => {
            const updatedBlog = await blogRef.get();
            res.status(200).json({
              success: true,
              message: "Blog is updated successfully !!",
              blogId: updatedBlog.id,
              blogDetails: updatedBlog.data(),
            });
          });
      } else {
        res.status(404).json({
          success: false,
          message: "You are not allowed to update this blog !!",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something broke in the server !!",
      error: error.message,
    });
  }
};

// DELETE BLOG --->
const deleteBlog = async (req, res) => {
  try {
    const blogRef = blogCollection.doc(req.params.id);
    const blog = await blogRef.get();
    if (blog.exists) {
      if (blog.data().email === req.body.email) {
        blogRef.delete().then(() => {
          res.status(200).json({
            success: true,
            message: "Blog has been deleted !!",
          });
        });
      } else {
        res.status(404).json({
          success: false,
          message: "You are not allowed to delete this blog !!",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Blog not found !!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something broke in the server !!",
      error: error.message,
    });
  }
};

// DELETE BLOG BY EMAIL ---->
const deleteBlogByEmail = (email) => {
  try {
    const query = blogCollection.where("email", "==", email);
    query.delete().then(() => {
      return "Blogs are deleted successfully !!";
    });
  } catch (error) {
    return error.message;
  }
};

// GET BLOG BY ID ---->
const getBlogById = async (req, res) => {
  try {
    const blogRef = blogCollection.doc(req.params.id);
    const blog = await blogRef.get();
    if (blog.exists) {
      res.status(200).json({
        success: true,
        message: "Blog found successfully !!",
        blogId: blog.id,
        title: blog.data().title,
        category: blog.data().category,
        description: blog.data().description,
        photo: blog.data().photo,
        createdAt: blog.data().createdAt.toDate(),
        email: blog.data().email,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Blog not found !!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something broke in the server !!",
      error: error.message,
    });
  }
};

// Get All Blogs --->
const getAllBlogs = async (req, res) => {
  try {
    const username = req.query.user;
    const catName = req.query.cat;
    let blogs = [];
    if (username) {
      const query = blogCollection.where("email", "==", username);
      const b = await query.get();
      if (!b.empty) {
        b.forEach((doc) => {
          const blog = {
            blogId: doc.id,
            title: doc.data().title,
            category: doc.data().category,
            description: doc.data().description,
            photo: doc.data().photo,
            createdAt: doc.data().createdAt.toDate(),
            email: doc.data().email,
          };
          blogs.push(blog);
        });
        res.status(200).json({
          success: route,
          message: "Blogs found successfully in this category !!",
          blogs,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "No Blog found of this user !!",
        });
      }
    } else if (catName) {
      const query = blogCollection.where(
        "category",
        "==",
        catName.toLowerCase()
      );
      const b = await query.get();
      if (!b.empty) {
        b.forEach((doc) => {
          const blog = {
            blogId: doc.id,
            title: doc.data().title,
            category: doc.data().category,
            description: doc.data().description,
            photo: doc.data().photo,
            createdAt: doc.data().createdAt.toDate(),
            email: doc.data().email,
          };
          blogs.push(blog);
        });
        res.status(200).json({
          success: route,
          message: "Blogs found successfully in this category !!",
          blogs,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "No Blog found in this category !!",
        });
      }
    } else {
      const blg = await blogCollection.get();
      if (!blg.empty) {
        blg.forEach((doc) => {
          const blog = {
            blogId: doc.id,
            title: doc.data().title,
            category: doc.data().category,
            description: doc.data().description,
            photo: doc.data().photo,
            createdAt: doc.data().createdAt.toDate(),
            email: doc.data().email,
          };
          blogs.push(blog);
        });
        res.status(200).json({
          success: route,
          message: "Blogs found successfully !!",
          blogs,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "No Blog found !!",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something broke in the server !!",
      error: error.message,
    });
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getAllBlogs,
  deleteBlogByEmail,
};
