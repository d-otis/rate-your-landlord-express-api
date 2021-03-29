const express = require('express')
const router = express.Router()

router.get("/", function(req, res, next) {
  // res.send("Landlords route!")
  res.json({route: "Landlords"})
})

module.exports = router