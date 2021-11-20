// any global packages that are needed go here
const path = require("path");

// third party packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const cors = require("cors");

// import files
const courseRoutes = require("./routes/course");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");

// import Objects/classes
const User = require("./models/user");
const Login = require("./login");

const MONGODB_URL = process.env.MONGODB_URL; console.log(MONGODB_URL);

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});

const csrfProtection = csrf();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

// adding features to support Heroku development
const corsOptions = {
  origin: "https://node-first-app-cse341.herokuapp.com/",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  family: 4,
};

// set session and user here
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// set the authentication and csrf token to prevent malware and ensure credentials are met
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // IMPORTANT: Replace this with notification of user being a teacher
  res.locals.isTeacher = req.user && req.user.role == "Teacher";
  // END
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(courseRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  res.redirect("/500");
});

mongoose
  .connect(MONGODB_URL, options)
  .then((result) => {
    app.listen(PORT);
    console.log("App listening on " + PORT);
  })
  .catch((err) => console.log(err));
