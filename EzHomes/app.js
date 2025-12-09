const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/EzHomes";
const Listing = require("./models/listings");
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
// mongoose connection
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./JOISchema");

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
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// landing route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  })
);
//new route
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});
// create new post route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    //NEW LEARNING- Model.create()
    await Listing.create(req.body);
    res.redirect("/listings");
  })
);
// show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
  })
);
//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
  })
);
//put  edit route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.Listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    const { title, description, price, country, location, image } = req.body;
    const listing = await Listing.findById(req.params.id);
    // Update fields
    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.country = country;
    listing.location = location;

    // Update image only if it exists in form
    if (image) {
      listing.image.url = image; // keep the object structure intact
    }
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);
  })
);

//delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedlist = await Listing.findByIdAndDelete(id);
    // console.log(deletedlist);
    res.redirect("/listings");
  })
);

//Reviewss---
//Post ROute
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new Review saved ");
    res.redirect(`/listings/${listing._id}`);
  })
);
/* delete review route */
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

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
