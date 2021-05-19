/* 
1. hello world fo pg-promise
2. #destroy_all equivalent @ top
3. generate data echoing ruby implementation

*/

const pgp = require("pg-promise")({
  capSQL: true
})

const db = pgp({ database: "rate_your_landlord_backend_development" })

const landlordsColumnSet = new pgp.helpers.ColumnSet([
  "name", "created_at", "updated_at", "image_url"
], { table: "landlords" })

const landlords = [
  { name: "Lydia Deetz", created_at: new Date(), updated_at: new Date(), image_url: "www.google.com" }
]

const insertLandlords = pgp.helpers.insert(landlords, landlordsColumnSet)

db.none(insertLandlords)
  .then((res) => {
    console.log('All landlords inserted')
  })
  .catch(err => {
    console.log({err})
  })