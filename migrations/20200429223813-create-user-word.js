
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserWords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serverId: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING
      },
      word: {
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
    return queryInterface.dropTable('UserWords')
  }
}
