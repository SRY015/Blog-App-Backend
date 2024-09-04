const express = require("express");
const cors = require("cors");
const authRouter = require("./Routes/auth.route");
const userRouter = require("./Routes/user.route");
const blogRouter = require("./Routes/blog.route");
const categoryRouter = require("./Routes/categories.route");
const multer = require("multer");
const path = require("path");
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(201).json("Image or file has been uploaded");
});

app.use("/Images", express.static(path.join(__dirname, "/Images")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);

app.get("/", (req, res) => {
  res.send("<h2>Welcome to the server.</h2>");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

module.exports = app;
