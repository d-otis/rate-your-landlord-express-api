const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  content: String,
  rating: Number,
  createdAt: Date,
  updatedAt: Date
})

const propertySchema = new mongoose.Schema({
  address: String,
  rating: Number,
  imageUrl: String,
  reviews: [reviewSchema],
  createdAt: Date,
  updatedAt: Date
})

const landlordSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  rating: Number,
  properties: [propertySchema],
  createdAt: Date,
  updatedAt: Date
})

module.exports = {
  landlordSchema,
  propertySchema,
  reviewSchema
}