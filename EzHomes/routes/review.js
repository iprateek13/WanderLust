const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview } = require("../Middleware");
const Listing = require("../models/listings");
const Review = require("../models/review");

//Reviewss---
//Post ROute
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review created");
    console.log("new Review saved ");
    res.redirect(`/listings/${listing._id}`);
  })
);
/* delete review route */
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "New review deleted");
    res.redirect(`/listings/${id}`);
  })
);
module.exports = router;
