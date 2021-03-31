const Pool = require('pg').Pool
const LandlordSerializer = require("../serializers/landlords.serializer")
const pool = new Pool({
  database: "rate_your_landlord_backend_development"
})

const getLandlords = (request, response) => {
  pool.query("SELECT * FROM landlords ORDER BY created_at DESC", (error, results) => {
    if (error) {
      throw error
    }
    const jsonapi = LandlordSerializer.serialize(results.rows)
    response.status(200).send(jsonapi)
  })
}

const getLandlordById = (request, response) => {
  // console.log(typeof request.params.id)
  const id = request.params.id
  pool.query("SELECT * FROM landlords WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getLandlords,
  getLandlordById
}