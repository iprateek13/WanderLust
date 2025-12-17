const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listings");
const { isLoggedIn, isOwner, validateListing } = require("../Middleware");

// INDEX ROUTE
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  })
);

// NEW FORM
router.get("/new", isLoggedIn, (req, res) => {
  console.log(req.user);
  res.render("listing/new.ejs");
});

// CREATE ROUTE
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing created");
    res.redirect("/listings");
  })
);

// SHOW ROUTE
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing that you are requested does not exist");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listing/show.ejs", { listing });
  })
);

// EDIT FORM
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing that you are requested does not exist");
      return res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { listing });
  })
);

// UPDATE ROUTE
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }

    let { id } = req.params;
    // Directly update using req.body.listing
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Review updated");
    res.redirect(`/listings/${id}`);
  })
);

// DELETE ROUTE
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
