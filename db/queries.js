const Pool = require('pg').Pool
const pool = new Pool({
  database: "rate_your_landlord_backend_development"
})

const getLandlords = (request, response) => {
  pool.query("SELECT * FROM landlords", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getLandlords
}