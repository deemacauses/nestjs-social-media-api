"use strict";

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn("user", "password");
  },

  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.addColumn("user", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
