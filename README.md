# Express Version of Rate Your Landlord Backend

## Start Dev Server

```DEBUG=rate-your-landlord-express:* npm start``

## Todo

- normalize JSON response so that it mirrors what rails backend serves
- start with trying to roll my own
- after that use Sequelize :-)
- refactor project structure to mirror node-pg documentation?
- add extra hacky attrs to reviews JSON
- POST/PATCH/DELETE routes bruh
- set random image for landlord from UNSPLASH like RoR
- hacky landlord rating and property updates when reviews are created
- make sure adding review => updates ratings for landlord and property

### Refactoring Queries

1. return raw nested objects from helper functions into variables
2. modify by adding associations if **applicable**
3. pass those into response.send()