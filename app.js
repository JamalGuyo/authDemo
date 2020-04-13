const express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  LocalStrategy = require("passport-local");
passportLocalMongoose = require("passport-local-mongoose");

// setup mongoose
mongoose
  .connect("mongodb://localhost/auth_demo_app", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log(`connected to auth_demo_app db`))
  .catch((err) => console.log(`Failed to connect to DB : ${err}`));

const app = express();

// setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/secret", (req, res) => {
  res.render("secret");
});

// listener
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`AuthDemo server listening on port ${port}...`)
);
