//Module imports
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        password: String
        name: String!
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    input UserInput {
        email: String!
        password: String!
        name: String!
    }

    type Deleted {
        message: String!
    }

    type RootQuery {
        users: [User!]!
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        createUser(userInput: UserInput): User
        updateUser(email: String!, password: String!, name: String!): User
        deleteUser(email: String!): Deleted
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);