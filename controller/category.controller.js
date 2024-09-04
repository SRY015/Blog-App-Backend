const db = require("../config/firebaseConfig");
const { v4: uuidv4 } = require("uuid");

const categoryCollection = db.collection("Category");

// CREATE CATEGORY --->
const createCategory = async (req, res) => {
  try {
    const presentCategories = await categoryCollection
      .where("name", "==", req.body.categoryName)
      .get();
    if (presentCategories.empty) {
      const newCat = {
        name: req.body.categoryName,
        createdAt: new Date(),
      };
      const id = uuidv4();
      await categoryCollection.doc(id).set(newCat);
      res.status(201).json({
        success: true,
        message: "New category is created successfully !!",
        categoryId: id,
        newCat,
      });
    } else {
      res.status(404).json({
        success: false,
        message:
          "Category is already exists please try someother category name!!",
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

// GET ALL CATEGORIES --->
const getAllCategories = async (req, res) => {
  try {
    let allCategories = [];
    const allCat = await categoryCollection.get();
    allCat.forEach((cat) => {
      const newCat = {
        id: cat.id,
        categoryName: cat.data().name,
        createdAt: cat.data().createdAt.toDate(),
      };
      allCategories.push(newCat);
    });
    res.status(200).json({
      success: true,
      allCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something broke in the server !!",
      error: error.message,
    });
  }
};

module.exports = { createCategory, getAllCategories };
