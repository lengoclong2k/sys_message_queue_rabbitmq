"use strict";

const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017/shop";

const TestSchema = new mongoose.Schema({ name: String });

const Test = mongoose.model("Test", TestSchema);

describe("Mongoose Connection", () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });

  // Close the connection to mongoose
  afterAll(async () => {
    await connection.disconnect();
  });

  it("should connect to mongoose", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("should save a document to the database", async () => {
    const user = new Test({ name: "Long" });
    await user.save();
    expect(user.isNew).toBe(false);
  });

  it("should find a document to the database", async () => {
    const user = await Test.findOne({ name: "Long" });
    expect(user).toBeDefined();
    expect(user.name).toBe("Long");
  });
});
