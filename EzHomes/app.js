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
const session = require("express-session");

const sessionOptions = {
   name: "mySessionId",
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionOptions));

const listings = require("./routes/listing");
const review = require("./routes/review");

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
// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

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
