/* eslint-disable @typescript-eslint/no-unused-vars */
"use strict";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require("@faker-js/faker");

async function up(queryInterface, Sequelize) {
  const posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      title: faker.faker.lorem.words(),
      caption: faker.faker.lorem.sentence(),
      userId: Math.floor(Math.random() * 10) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await queryInterface.bulkInsert("post", posts);
}
async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete("post", null, {});
}

module.exports = { up, down };
