const pool = require("../pool")
const ReviewsSerializer = require("../../serializers/reviews.serializer")
const { serverError } = require('../util')
const {
  queryAllReviews
} = require('../helpers')

const updatePropertyRating = async id => {
  // take incoming property id and use it to
  // update property rating based on review averages

  // 1. get new average from db
  // 2. update said property
  const queryText = `SELECT AVG(reviews.rating) AS "average"
                    FROM reviews
                    JOIN properties ON properties.id = reviews.property_id 
                    JOIN landlords ON landlords.id = properties.landlord_id
                    WHERE reviews.property_id = $1;`

  const newAverage = await pool.query(queryText, [id])

  console.log({foley: newAverage.rows[0].avg})

  const updatedProperty = await pool.query("UPDATE properties SET rating = $1 WHERE id = $2 RETURNING *", [parseFloat(newAverage), id])

  console.log({ updatedProperty })
  return updatedProperty.rows[0]
}

const getReviews = async (request, response) => {
  try {
    const reviews = await queryAllReviews()

    response.status(200).send(ReviewsSerializer.serialize(reviews))
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
    const propertyRating = await updatePropertyRating()
    console.log({propertyRating})
    response.status(201).send(ReviewsSerializer.serialize(reviewsResponse.rows[0]))
  } catch (error) {
    console.log(error)
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