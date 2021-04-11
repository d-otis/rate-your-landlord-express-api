const pluralFix = (attribute) => {
  switch (attribute) {
    case "properties":
      return "property"
    case "reviews":
      return "review"
    default:
      return undefined
  }
}

const serverError = { error: "there was an error - check the logs" }

module.exports = {
  pluralFix,
  serverError
}