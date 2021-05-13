const pool = require('../pool')

  // _                    _ _               _     
//  | |    __ _ _ __   __| | | ___  _ __ __| |___ 
//  | |   / _` | '_ \ / _` | |/ _ \| '__/ _` / __|
//  | |__| (_| | | | | (_| | | (_) | | | (_| \__ \
//  |_____\__,_|_| |_|\__,_|_|\___/|_|  \__,_|___/

const queryAllLandlords = async () => {
  const landlordsQueryText = "SELECT * FROM landlords ORDER BY created_at DESC"

  const { rows: landlordsRows } = await pool.query(landlordsQueryText)

  return landlordsRows
}

const updateLandlordRating = async (landlordId) => {
  const getNewAverageQueryText = `SELECT AVG(reviews.rating), landlords.name
                    FROM properties
                    JOIN landlords ON properties.landlord_id = landlords.id
                    JOIN reviews ON properties.id = reviews.property_id
                    WHERE landlords.id = $1
                    GROUP BY landlords.id`

  const result = await pool.query(getNewAverageQueryText, [landlordId])
  const { avg: newRating } = result.rows[0]

  const updateLandlordRatingQueryText = `UPDATE landlords SET rating = $1 WHERE id = $2 RETURNING *`

  const updatedLandlord = await pool.query(updateLandlordRatingQueryText, [newRating, landlordId])

}


  // ____                            _   _           
//  |  _ \ _ __ ___  _ __   ___ _ __| |_(_) ___  ___ 
//  | |_) | '__/ _ \| '_ \ / _ \ '__| __| |/ _ \/ __|
//  |  __/| | | (_) | |_) |  __/ |  | |_| |  __/\__ \
//  |_|   |_|  \___/| .__/ \___|_|   \__|_|\___||___/
//                  |_| 

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

const updatePropertyRatingAndReturnLandlord = async id => {
  const queryText = `SELECT AVG(reviews.rating), landlords.id AS landlord_id
                    FROM reviews
                    JOIN properties ON properties.id = reviews.property_id 
                    JOIN landlords ON landlords.id = properties.landlord_id
                    WHERE reviews.property_id = $1
                    GROUP BY landlords.id`

  const newAverage = await pool.query(queryText, [id])

  await pool.query("UPDATE properties SET rating = $1 WHERE id = $2 RETURNING *", [parseFloat(newAverage.rows[0].avg), id])

  return newAverage.rows[0]
}

  // ____            _                   
//  |  _ \ _____   _(_) _____      _____ 
//  | |_) / _ \ \ / / |/ _ \ \ /\ / / __|
//  |  _ <  __/\ V /| |  __/\ V  V /\__ \
//  |_| \_\___| \_/ |_|\___| \_/\_/ |___/

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
  updateLandlordRating,
  queryAllProperties,
  findPropertiesBy,
  updatePropertyRatingAndReturnLandlord,
  queryAllReviews,
  findReviewsBy
}