const Pool = require('pg').Pool
const pool = new Pool({
  database: "rate_your_landlord_backend_development"
})

module.exports = pool