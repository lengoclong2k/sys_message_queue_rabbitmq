"use strict";

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbitmq");

// const log = console.log;

// console.log = function () {
//   log.apply(console, [new Date()].concat(arguments));
// };
const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.log(`Error consumerToQueue::`, error);
    }
  },

  // case processing
  consumerToQueueNormal: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notiQueue = "notificationQueueProcess"; // assertQueue

      //1. TTL

      //2. LOGIC
      channel.consume(notiQueue, (msg) => {
        try {
          const numberTest = Math.random();
          console.log({ numberTest });

          if (numberTest < 0.8) {
            throw new Error("Send notification failed:: HOT FIX");
          }

          console.log(
            `Send notificationQueue sucessfully processed::`,
            msg.content.toString()
          );
          channel.ack(msg);
        } catch (error) {
          // console.error(`Send notification error::`, error);
          channel.nack(msg, false, false);
          /*
            nack: negative acknownledgement
          */
        }
      });

      // channel.consume(notiQueue, (msg) => {
      //   console.log(
      //     `SEND notificationQueue successfully processed`,
      //     msg.content.toString()
      //   );
      //   channel.ack(msg);
      // });
    } catch (error) {
      console.log("Long");
      console.error(error);
    }
  },

  // case failed processing
  consumerToQueueFailed: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      const notificationExchangeDLX = "notificationExDLX"; //notificationEx direct
      const notificationRoutingKeyDLX = "notificationRoutingKeyDLX"; // asert

      const notiQueueHandler = "notificationQueueHotFix";
      await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );

      await channel.consume(
        queueResult.queue,
        (msgFailed) => {
          console.log(
            `this notification error:, pls hot fix::`,
            msgFailed.content.toString()
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

module.exports = messageService;
