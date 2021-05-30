const { sharedAuth } = require('../auth-directive');
const { attachDirectiveResolvers } = require('graphql-tools');
const { buildFederatedSchema } = require('@apollo/federation');
const { gql } = require('apollo-server');

const typeDefs = gql`

  ${sharedAuth.authDirective}

  type Query {
    catFact: Fact @hasRoles(roles: ["CATFACTS"])
    review: Review @hasRoles(roles: ["REVIEWS"])
  }
  
  type Fact {
    fact: String
    length: Int
  }
  
  type Review @key(fields: "id") {
    id: ID!
    review: String
   }
`;

const resolvers = {
    Query: {
        async catFact(_, context, {dataSources}) {
            return await dataSources.cats.getFact()
        },
        async review() {
            return { id: '1234-1234-1234-1234', review: 'blablabla' }
        }
    },
};

const directiveResolvers = {
    hasRoles: sharedAuth.authResolver
};

let schema = buildFederatedSchema([{ typeDefs, resolvers }]);

attachDirectiveResolvers(
    schema,
    directiveResolvers,
);

module.exports = schema;