const {GraphQLError} = require("graphql");

const { ApolloServer } = require('apollo-server');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');
const { sign } = require('../jwt-utils');

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
    willSendRequest({ request, context }) {
        const token = sign({
            capabilities: ['REVIEWS', 'COMMENTS', 'CATFACTS'],
        });

        request.http.headers.set('x-token', token);
    }
}

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'reviews', url: 'http://localhost:4001' },
        { name: 'comments', url: 'http://localhost:4002' },
    ],
    buildService: ({ url }) => ( new AuthenticatedDataSource({ url }) ),
});

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
    gateway,
    formatError: (error) =>  {
        console.log(error instanceof GraphQLError)
        if (error instanceof GraphQLError) {
            console.log(error?.extensions)
            return {
                service: error?.extensions?.serviceName,
                error: error?.extensions?.exception?.message,
            }
        }
        return {
            service: error?.extensions?.serviceName,
            error: error?.extensions?.exception.message,
            violatingField: error?.extensions?.exception?.path[error?.extensions?.exception?.path?.length-1]
        }
    },
    subscriptions: false,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Gateway ready at ${url}`);
});