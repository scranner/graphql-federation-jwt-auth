const schema = require('./schema');
const CatFactsAPI = require('../datasources/cats');
const { ApolloServer } = require('apollo-server');
const { decode } = require('../jwt-utils');

const server = new ApolloServer({
    schema,
    context: ({ req }) => {
        const token = req.headers['x-token'];
        const decodedToken = decode(token);

        if (decodedToken) {
            return decodedToken;
        }

        return {}
    },
    dataSources: () =>  ({
        cats: new CatFactsAPI(),
    })
});

server.listen(4001).then(({ url }) => {
    console.log(`🚀 SubGraph ready at ${url}`);
});