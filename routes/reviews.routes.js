const express = require('express')
const router = express.Router()
const db = require("../db/queries")

router.get("/", db.getReviews)
router.post("/", db.createReview)

module.exports = router