
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TicketRoles', {
      serverId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      roleId: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TicketRoles')
  }
}
