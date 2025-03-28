"use strict";

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbitmq");

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.log(`Error consumerToQueue::`, error);
    }
  },
};

module.exports = messageService;
