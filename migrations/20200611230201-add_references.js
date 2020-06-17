

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'FormFields',
        'ticketFormId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'TicketForms',
            key: 'id'
          },
          onDelete: 'CASCADE'
        }
      ),
      queryInterface.changeColumn(
        'TicketFields',
        'formFieldId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'FormFields',
            key: 'id'
          },
          onDelete: 'CASCADE'
        }
      ),
      queryInterface.changeColumn(
        'Tickets',
        'ticketFormId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'TicketForms',
            key: 'id'
          },
          onDelete: 'CASCADE'
        }
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'FormFields',
        'ticketFormId',
        {
          type: Sequelize.INTEGER
        }
      ),
      queryInterface.changeColumn(
        'TicketFields',
        'formFieldId',
        {
          type: Sequelize.INTEGER
        }
      ),
      queryInterface.changeColumn(
        'Tickets',
        'ticketFormId',
        {
          type: Sequelize.INTEGER
        }
      )
    ])
  }
}
