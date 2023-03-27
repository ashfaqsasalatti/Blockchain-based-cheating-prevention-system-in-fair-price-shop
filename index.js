const express = require("express");
const app = express();

app.use(express.static("views"));
// Set the view engine and views folder
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("menu");
});

app.get("/add", (req, res) => {
  res.render("add_user");
});

app.get("/distribute", (req, res) => {
  res.render("dist_login");
});

app.get("/repo", (req, res) => {
  res.render("reports");
});

app.get("/gov", (req, res) => {
  res.render("gov");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
