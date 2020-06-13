'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'TicketForms',
      'state',
      {
        type: Sequelize.ENUM,
        values: [
          'active',
          'inactive'
        ],
        defaultValue: 'active'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'TicketForms',
      'state'
    )
  }
};
