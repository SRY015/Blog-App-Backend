const db = require("../config/firebaseConfig");
const bcrypt = require("bcrypt");
const blogCollection = db.collection("blogs");
const fs = require("fs");
 
const userCollection = db.collection("users");

// Get user by id ---->
const getUserById = async (req, res) => {
  try {
    const userRef = userCollection.doc(req.params.id);
    const user = await userRef.get();
    if (user.exists) {
      const { password, ...otherDetails } = user.data();
      res.status(200).json({
        success: true,
        message: "User found successfully !!",
        user: otherDetails,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found !!",
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

// Update user ---->
const updateUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const userRef = userCollection.doc(req.params.id);
      const user = await userRef.get();
      if (user.exists) {
        if (req.body.password) {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        userRef.update(req.body).then(async () => {
          const updatedUser = await userRef.get();
          const { password, ...otherDetails } = updatedUser.data();
          res.status(200).json({
            success: true,
            message: "User is updated successfully !!",
            user: otherDetails,
          });
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found !!",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Something broke in the server !!",
        error: error.message,
      });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "You are not allowed to perform this operation !!",
    });
  }
};

// Delete user ---->
const deleteUser = async (req, res) => {
  try {
    const userRef = userCollection.doc(req.params.id);
    const user = await userRef.get();
    if (user.exists) {
      userRef
        .delete()
        .then(async () => {
          if (user.data().profilePic) {
            fs.unlinkSync(__dirname + `/../Images/${doc.data().profilePic}`);
          }
          const querySnap = await blogCollection
            .where("email", "==", user.data().email)
            .get();
          querySnap.forEach((doc) => {
            fs.unlinkSync(__dirname + `/../Images/${doc.data().photo}`);
          });
          const batch = db.batch();
          querySnap.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();
          res.status(200).json({
            success: true,
            message: "User has been deleted !!",
          });
        })
        .catch((err) => {
          res.status(404).json({
            success: false,
            message: "User is not deleted successfully !!",
            error: err.message,
          });
        });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found !!",
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

module.exports = { getUserById, updateUser, deleteUser };
