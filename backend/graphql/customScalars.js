const { GraphQLScalarType } = require('graphql');

const Date = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        return value // value sent to the client
    },
    parseValue(value) {
        return new Date(value) // value from the client
    },
    parseLiteral(ast) {
        return new Date(ast.value)
    }
});

module.exports.Date = Date;