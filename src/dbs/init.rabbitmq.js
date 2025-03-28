"use strict";

const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://admin:admin@localhost");
    if (!connection) throw new Error("Connection not established");

    const channel = await connection.createChannel();

    return { channel, connection };
  } catch (error) {
    console.log("Error", error);
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();

    //Publish message to a queue
    const queue = "test-queue";
    const message = "Hello, shopDev by Long";
    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(message));

    //close the connection
    await connection.close;
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
    throw error;
  }
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, {
      durable: true,
    });
    console.log(`Waiting for messages ...`);
    channel.consume(
      queueName,
      (msg) => {
        console.log(
          `Received message:: ${queueName}::`,
          msg.content.toString()
        );
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error(`error publish message to rabbitmq::`, error);
    throw error;
  }
};

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
  consumerQueue,
};
