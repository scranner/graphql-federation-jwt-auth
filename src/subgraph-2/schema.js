const { sharedAuth } = require('../auth-directive');
const { attachDirectiveResolvers } = require('graphql-tools');
const { buildFederatedSchema } = require('@apollo/federation');
const { gql } = require('apollo-server');

const typeDefs = gql`

  ${sharedAuth.authDirective}

  type Query {
    comment: Comment @hasRoles(roles: ["COMMENTS"])
  }

  type Comment @key(fields: "id") {
    id: ID!
  }
  
  extend type Review @key(fields: "id") {
    id: ID! @external
    comment: Comment @hasRoles(roles: ["COMMENTS"])
   }
`;

const resolvers = {
    Review: {
        __resolveReference(review, { dataSources }) {
            return { comment: { id: '12' }};
        }
    }
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