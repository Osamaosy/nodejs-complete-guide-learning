const express = require("express");
const router = express.Router();
const path = require("path");
const rootDir = require("../util/path");
const adminData = require("./admin");

router.get("/", (req, res, next) => {
  res.render("shop", {
    prods: adminData.products,
    pageTitle:  "shop",
    path: "/",
    hasProduct: adminData.products.length > 0,
  });
});

module.exports = router;
