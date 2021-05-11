const pool = require('../pool')


/* 
LANDLORDS
*/
const queryAllLandlords = async () => {
  const landlordsQueryText = "SELECT * FROM landlords ORDER BY created_at DESC"

  const { rows: landlordsRows } = await pool.query(landlordsQueryText)

  return landlordsRows
}


/* 
PROPERTIES 
*/

const queryAllProperties = async () => {
  const propertiesQueryObj = {
    text: "SELECT * FROM properties ORDER BY created_at DESC"
  }

  const { rows: propertyRows } = await pool.query(propertiesQueryObj)

  return propertyRows
}

const findPropertiesBy = async (config) => {
  const { id } = config

  switch (config.type) {
    case "landlord": {
      const getOwnedPropertiesQueryText = "SELECT * FROM properties WHERE properties.landlord_id = $1"
      const { rows } = await pool.query(getOwnedPropertiesQueryText, [id])
      return rows
    }
    default:
      break;
  }
}

/* 
REVIEWS
*/

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

module.exports = {
  queryAllLandlords,
  queryAllProperties,
  findPropertiesBy,
  queryAllReviews,
  findReviewsBy
}