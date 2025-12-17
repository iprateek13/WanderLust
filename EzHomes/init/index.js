const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listings");
const MONGO_URL = "mongodb://127.0.0.1:27017/EzHomes";
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
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6941213f25e0dbe7ccd09961",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initially saved");
};
initDB();
