const express = require('express')
const router = express.Router()
const db = require('../db/queries')

router.get("/", db.getProperties)
router.post("/", db.createProperty)
router.patch("/:id", db.updateProperty)
router.delete("/:id", db.deleteProperty)

module.exports = router