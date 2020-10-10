module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.createTable('VoiceRoles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serverId: {
        type: Sequelize.STRING
      },
      channelId: {
        type: Sequelize.STRING
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
  down: async(queryInterface) => {
    await queryInterface.dropTable('VoiceRoles')
  }
}
