/* 
1. hello world fo pg-promise
2. #destroy_all equivalent @ top
3. generate data echoing ruby implementation
  a. generate array of Faked image urls
  b. generate array of fake names, dates, and attach images
*/
const faker = require('faker')
const { unsplash } = require('../unsplash')
const format = require('pg-format')
const pool = require('./pool')

const numLandlords = 5
const numPropertiesPerLandlord = 3
const numProperties = numLandlords * numPropertiesPerLandlord

const generateLandlordImages = async (num) => {
  const { response } = await unsplash.photos.getRandom({ query: "person", orientation: "squarish", count: num })
  return response
}

const generatePropertyImages = async (num) => {
  const { response } = await unsplash.photos.getRandom({ query: "apartment", orientation: 'landscape', count: num })
  return response
}

const generateProperties = async (num) => {
  const images = await generatePropertyImages(num)

  let properties = []
  for (let i = 0; i < num; i++) {
    properties.push([
      `${faker.address.streetAddress()} ${faker.address.streetSuffix()} ${faker.address.stateAbbr()} ${faker.address.zipCode()}`,
      images[i].urls.regular,
      faker.date.past(),
      faker.date.recent()
    ])
  }
  return properties
}

const generateLandlords = async (num) => {
  const images = await generateLandlordImages(num)

  let landlords = []
  for (let i = 0; i < num; i++) {
    landlords.push([
      faker.name.findName(),
      images[i].urls.regular,
      faker.date.past(),
      faker.date.recent()
    ])
  }
  return landlords
}

const destroyAllData = async () => {
  await pool.query("DELETE FROM landlords")
  await pool.query("DELETE FROM properties")
  await pool.query("DELETE FROM reviews")
}

const seedDatabase = async () => {

  await destroyAllData()

  const landlordsValues = await generateLandlords(numLandlords)
  const landlordsQuery = format("INSERT INTO landlords (name, image_url, created_at, updated_at) VALUES %L RETURNING *", landlordsValues)

  const { rows: landlords } = await pool.query(landlordsQuery)

  const landlordIds = landlords.map(landlord => landlord.id)

}

seedDatabase()