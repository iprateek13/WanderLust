const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/EzHomes";
// const Listing = require("./models/listings");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
const ExpressError = require("./utils/ExpressError");
// const wrapAsync = require("./utils/wrapAsync");
// const Review = require("./models/review");
// const { listingSchema, reviewSchema } = require("./JOISchema");
const flash = require("connect-flash");
const session = require("express-session");
const review = require("./routes/review");
const listings = require("./routes/listing");

// mongoose connection
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const sessionOptions = {
  name: "mySessionId",
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Root route

/*routing of listing router using express router*/
app.use("/listings", listings);

/*routing of  router using express router*/
app.use("/listings/:id/reviews", review);

// TODO -- Catch-all 404
app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { err });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
