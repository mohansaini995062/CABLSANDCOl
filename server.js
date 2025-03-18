import dotenv from "dotenv";
dotenv.config();

import express from "express";
import ExpressError from "./utils/ExpressError.js";
import database from "./config/database.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import ejs from "ejs";

import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "express-flash";

// import routes
import userRoute from "./routes/user.route.js";
import Contact from "./models/contact.model.js";
import sendEmail from "./utils/sendEmail.js";

const app = express();
const port = process.env.PORT;

// set ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// use static files
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true },
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.token = req.cookies.token;
  // console.log(req.cookies)
  next();
});

app.get("/err", (req, res, next) => {
  return next(new ExpressError(500, "Error Hai bhai"));
});

// routes
app.use("/user", userRoute);

app.get("/", (req, res) => {
  // console.log(req.cookies)
  res.render("index.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.post("/contact", async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;
  if (!firstName || !lastName || !email || !message || !phone) {
    req.flash("error", "Please fill this form");
    return res.redirect("/contact");
  }
  let FRONTEND_URL = process.env.FRONTEND_URL;
  let contactEmailHTMLTemplate = await ejs.renderFile(
    path.join(__dirname, "./views/templates/contactEmail.ejs"),
    { firstName, lastName, email, message, FRONTEND_URL }
  );

  await sendEmail(
    email,
    `Contact Form Submission from ${firstName}`,
    contactEmailHTMLTemplate
  );

  req.flash("success", "Email sent successfully!");
  res.redirect("/contact");
});

app.get("/services", (req, res) => {
  res.render("services.ejs");
});

app.get("/gst", (req, res) => {
  res.render("gst.ejs");
});

app.get("/Knowledge_bank", (req, res) => {
  res.render("Knowledge_bank.ejs");
});

app.get("/Our_Team", (req, res) => {
  res.render("Our_Team.ejs");
});

app.get("/Gallery", (req, res) => {
  res.render("Gallery.ejs");
});

// 404
app.get("/*", (req, res) => {
  res.render("404.ejs");
});

// alert("hello");

// error handling
app.use((err, req, res, next) => {
  console.log(err);
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { msg: message });
});

app.listen(port, () => {
  console.log(`Server start on port : ${port}`);
  database();
});
