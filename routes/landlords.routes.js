const express = require('express')
const router = express.Router()
const db = require('../db/queries')

router.get("/", db.getLandlords)
router.get("/:id", db.getLandlordById)
router.post("/", db.createLandlord)
router.patch("/:id", db.updateLandlord)
router.delete("/:id", db.deleteLandlord)

module.exports = router