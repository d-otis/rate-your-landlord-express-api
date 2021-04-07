const express = require('express')
const router = express.Router()
const db = require("../db/queries")

router.get("/", db.getReviews)

module.exports = router