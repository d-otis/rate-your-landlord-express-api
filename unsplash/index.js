const nodeFetch = require('node-fetch')
const { createApi } = require('unsplash-js')
const dotenv = require('dotenv').config()

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch
})

module.exports = {
  unsplash
}