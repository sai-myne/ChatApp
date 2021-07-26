const { Message, User } = require("../../models");
const { Op } = require("sequelize");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { withFilter } = require('graphql-subscriptions');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

module.exports = {
  Query: {
    getMessages: async (parent, { from }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        const otherUser = await User.findOne({
          where: { username: from },
        });
        if (!otherUser) throw new UserInputError("User not found");
        const usernames = [user.username, otherUser.username];

        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          order: [["createdAt", "DESC"]],
        });

        return messages;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const recipient = await User.findOne({ where: { username: to } });

        if (!recipient) {
          throw new UserInputError("User not found");
        } else if (recipient.username === user.username) {
          throw new UserInputError("You cant send message yourself");
        }

        if (content.trim() === "") {
          throw new UserInputError("content is empty");
        }
        const message = await Message.create({
          from: user.username,
          to,
          content,
        });

        pubsub.publish("NEW_MESSAGE", { newMessage: message });

        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Subscription: {
    newMessage: {
      // subscribe: () => pubsub.asyncIterator(['NEW_MESSAGE']),
      subscribe: withFilter((_, __, { user }) => {
        if(!user) throw new AuthenticationError('Unauthenticated')
        return pubsub.asyncIterator(['NEW_MESSAGE'])
      }, ({ newMessage }, _, { user }) => {
        if(newMessage.from === user.username || newMessage.to === user.username){
          return true
        }
        return false
      }), 
    }
  },
};
