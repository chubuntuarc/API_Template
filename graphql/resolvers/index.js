//Resolver routes.

//Resolvers
const userResolver = require('./user');

//Get all the resolvers.
const rootResolver = {
    ...userResolver
};

module.exports = rootResolver;