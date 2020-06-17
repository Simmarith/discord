
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Prefixes', {
      serverId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      value: {
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
    return queryInterface.dropTable('Prefixes')
  }
}
