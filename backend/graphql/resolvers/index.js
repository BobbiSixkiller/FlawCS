const userResolver = require('./user');
const conferenceResolver = require('./conference');

module.exports = {
    Query: {
        ...userResolver.Query,
        ...conferenceResolver.Query
    }
}