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

module.exports = {
  getReviews
}