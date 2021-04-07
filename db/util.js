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

module.exports = {
  pluralFix
}