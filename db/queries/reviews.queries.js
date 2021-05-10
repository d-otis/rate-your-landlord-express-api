const pool = require("../pool")
const ReviewsSerializer = require("../../serializers/reviews.serializer")
const { serverError } = require('../util')

const queryAllReviews = async () => {
  const reviewsQueryObj = {
    text: "SELECT * FROM reviews ORDER BY created_at DESC"
  }
  const { rows: reviewRows } = await pool.query(reviewsQueryObj)

  return reviewRows
}

const findReviewsBy = async (config) => {
  const { id } = config
  switch (config.type) {
    case "landlord": {
      const getReviewsByLandlordQueryText = `SELECT reviews.*
                                            FROM reviews
                                            JOIN properties ON properties.id = reviews.property_id
                                            JOIN landlords ON properties.landlord_id = landlords.id
                                            WHERE landlords.id = $1`
      const { rows } = await pool.query(getReviewsByLandlordQueryText, [id])

      return rows
    }
    case "property": {
      const getOwnedReviewsQueryText = `SELECT * FROM reviews WHERE reviews.property_id = $1`
      const { rows } = await pool.query(getOwnedReviewsQueryText, [id])

      return rows
    }
    default:
      break;
  }
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
  queryAllReviews,
  findReviewsBy,

  getReviews,
  createReview,
  updateReview
}