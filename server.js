const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const { sequelize } = require("./models");
const contextMiddleware = require("./util/contextMiddleware");
// A map of functions which return data for the schema.
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config/env.json");

// const { PubSub } = require('graphql-subscriptions');
// const pubsub = new PubSub();



(async function () {
  const app = express();

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
    context: contextMiddleware,
  });
  await server.start();

  sequelize
    .authenticate()
    .then(() => console.log("Database connected!!"))
    .catch((err) => console.log(err));

  server.applyMiddleware({ app });

  // async function findUser(authToken) {
  //   // find a user by auth token
  //   console.log(authToken)
  // }

  
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      async onConnect(connectionParams, webSocket) {
        // console.log(connectionParams)
        if (connectionParams.Authorization) {
          const context = {}
          const token = connectionParams.Authorization.split('Bearer ')[1]
          if (token) {
            jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
              context.user = decodedToken
            })
          }
          // context.pubsub = pubsub
          // console.log(context)
          return context
        }
        throw new Error("Missing auth token!");
      },
    },
    { server: httpServer, path: server.graphqlPath }
  );

  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
})();

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: contextMiddleware,
// });

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);

//   sequelize.authenticate()
//     .then(() => console.log("Database connected!!"))
//     .catch(err => console.log(err))
// });
