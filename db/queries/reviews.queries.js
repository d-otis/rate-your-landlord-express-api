const pool = require("../pool")
const ReviewsSerializer = require("../../serializers/reviews.serializer")
const { serverError } = require('../util')

const getReviews = async (request, response) => {
  const text = "SELECT * FROM reviews ORDER BY created_at DESC"

  try {
    const res = await pool.query(text)
    const rawReviews = res.rows

    response.status(200).send(ReviewsSerializer.serialize(rawReviews))
  } catch (error) {
    console.log(error)
    response.status(500).send(serverError)
  }
}

const createReview = async (request, response) => {
  const { content, rating, propertyId } = request.body
  const createdAt = new Date(), updatedAt = createdAt

  const createReviewQueryText = `INSERT INTO reviews(content, rating, property_id, created_at, updated_at)
                                VALUES($1, $2, $3, $4, $5)
                                RETURNING *`

  try {
    const reviewsResponse = await pool.query(createReviewQueryText, [content, rating, propertyId, createdAt, updatedAt])
    
    response.status(201).send(ReviewsSerializer.serialize(reviewsResponse.rows[0]))
  } catch (error) {
    response.status(500).send(serverError)
  }
}

const updateReview = async (request, response) => {
  const { id } = request.params
  const { content, rating } = request.body
  const updatedAt = new Date()

  const updateReviewQueryText = `UPDATE reviews
                                SET content = $1, rating = $2, updated_at = $3
                                WHERE id = $4
                                RETURNING *`
  try {
    const reviewResponse = await pool.query(updateReviewQueryText, [content, rating, updatedAt, id])

    response.status(200).send(ReviewsSerializer.serialize(reviewResponse.rows[0]))
  } catch (error) {
    console.log(error)
    response.status(500).send(serverError)
  }
}

module.exports = {
  getReviews,
  createReview,
  updateReview
}