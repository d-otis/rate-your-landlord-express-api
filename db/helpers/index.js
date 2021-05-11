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
  updatePropertyRating,
  queryAllReviews,
  findReviewsBy
}