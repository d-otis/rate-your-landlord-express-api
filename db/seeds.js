/* 
1. hello world fo pg-promise
2. #destroy_all equivalent @ top
3. generate data echoing ruby implementation
  a. generate array of Faked image urls
  b. generate array of fake names, dates, and attach images
*/
const faker = require('faker')
const { unsplash } = require('../unsplash')
const pgp = require("pg-promise")({
  capSQL: true
})

const db = pgp({ database: "rate_your_landlord_backend_development" })

const landlordsColumnSet = new pgp.helpers.ColumnSet([
  "name", "created_at", "updated_at", "image_url"
], { table: "landlords" })

const numLandlords = 5
const numPropertiesPerLandlord = 3
const numApartmentPhotos = numLandlords * numPropertiesPerLandlord

const generateLandlordImages = async (num) => {
  const { response } = await unsplash.photos.getRandom({ query: "person", orientation: "squarish", count: num })
  return response
}

const generateLandlords = async (num) => {
  const images = await generateLandlordImages(num)

  let landlords = []
  for (let i = 0; i < num; i++) {
    landlords.push({
      name: faker.name.findName(),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
      image_url: images[i].urls.regular
    })
  }
  return landlords
}

const seedDatabase = async () => {
  const landlords = await generateLandlords(numLandlords)
  const insertLandlords = pgp.helpers.insert(landlords, landlordsColumnSet)

  db.none(insertLandlords)
    .then((res) => {
      console.log('All landlords inserted')
    })
    .catch(err => {
      console.log({err})
    })
}

seedDatabase()