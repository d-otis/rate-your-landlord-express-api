const nodeFetch = require('node-fetch')
const { createApi } = require('unsplash-js')
const dotenv = require('dotenv').config()

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch
})

const getRandomLandlordImage = async () => {
  const { response } = await unsplash.photos.getRandom({ query: "person", orientation: "squarish" })
  return response.urls.regular
}

module.exports = {
  unsplash,
  getRandomLandlordImage
}