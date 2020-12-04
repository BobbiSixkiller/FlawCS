const userResolver = require('./user');
const conferenceResolver = require('./conference');
const { Date } = require('../customScalars');

module.exports = {
    Date: Date,
    Query: {
        ...userResolver.Query,
        ...conferenceResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation
    }
}