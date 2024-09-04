const db = require("../config/firebaseConfig");
// const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userCollection = db.collection("users");

// Register user ---->
const registerUser = async (req, res) => {
  try {
    const userRef = userCollection.doc(req.body.email);
    const query = userCollection.where("email", "==", req.body.email);
    query.get().then((user) => {
      if (user.empty) {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          if (!err) {
            const newUser = {
              username: req.body.username,
              email: req.body.email,
              password: hash,
              createdAt: new Date(),
            };
            userRef
              .set(newUser)
              .then(() => {
                const { password, ...otherDetails } = newUser;
                res.status(201).json({
                  success: true,
                  message: "User is created successfully !!",
                  user: otherDetails,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  success: false,
                  message: "User is not created !!",
                  error: err,
                });
              });
          }
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User is already exists please use someother email.",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something broke in the server !!",
      error: error.message,
    });
  }
};

// Login User ---->
const loginUser = async (req, res) => {
  try {
    const userRef = userCollection.doc(req.body.email);
    const user = await userRef.get();
    if (user.exists) {
      const pass = user.data().password;
      bcrypt.compare(req.body.password, pass, (err, result) => {
        if (result) {
          //const { password, ...otherDetails } = user.data();
          res.status(200).json({
            success: true,
            message: "User is loggedin successfully !!",
            email: user.data().email,
            username: user.data().username,
            profilePic: user.data().profilePic,
          });
        } else {
          res.status(404).json({
            success: false,
            message: "Invalid email or password !!",
          });
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Invalid email or password !!",
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

module.exports = { registerUser, loginUser };
