const pool = require("../pool")
const ReviewsSerializer = require("../../serializers/reviews.serializer")

const getReviews = (request, response) => {
  pool.query("SELECT * FROM reviews ORDER BY created_at DESC", (error, results) => {
    response.send(ReviewsSerializer.serialize(results.rows))
  })
}

module.exports = {
  getReviews
}