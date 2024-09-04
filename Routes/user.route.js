const router = require("express").Router();
const {
  updateUser,
  deleteUser,
  getUserById,
} = require("../controller/user.controller");

// GET USER BY ID --->
router.get("/:id", getUserById);

// UPDATE USER --->
router.put("/:id", updateUser);

// DELETE USER --->
router.delete("/:id", deleteUser);

module.exports = router;
