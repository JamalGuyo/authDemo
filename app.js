const express = require("express"),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user");

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

// auth setup
app.use(
  require("express-session")({
    secret: "Js is awesome",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/secret", isLoggedIn, (req, res) => {
  res.render("secret");
});

// AUTH ROUTES
// register route
app.get("/register", (req, res) => {
  res.render("register");
});

// post route
app.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secret");
        });
      }
    }
  );
});

// SIGN IN
app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login",
  }),
  (re, res) => {}
);
// logout
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// isLoggedIn middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// listener
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`AuthDemo server listening on port ${port}...`)
);
