const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../JOISchema");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listings");

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

// INDEX ROUTE
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  })
);

// NEW FORM
router.get("/new", (req, res) => {
  res.render("listing/new.ejs");
});

// CREATE ROUTE
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
     const listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("success","New Listing created")
    res.redirect("/listings");   
  })
);

// SHOW ROUTE
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error","Listing that you are requested doest not exist")
     return res.redirect("/listings")
    }
    res.render("listing/show.ejs", { listing });
  })
);

// EDIT FORM
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("listing/edit.ejs", { listing });
  })
);

// UPDATE ROUTE
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {

    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }

    const { id } = req.params;

    // Directly update using req.body.listing
    const listing = await Listing.findByIdAndUpdate(
      id,
      req.body.listing,
      { new: true, runValidators: true }
    );
 req.flash("success","Review updated")
    res.redirect(`/listings/${id}`);
  })
);


// DELETE ROUTE
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
       req.flash("success","Listing Deleted")
    res.redirect("/listings");   
  })
);


module.exports = router;
