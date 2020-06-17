

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Tickets',
        'state',
        {
          type: Sequelize.ENUM,
          values: [
            'open',
            'claimed',
            'closed'
          ],
          defaultValue: 'open'
        }
      ),
      queryInterface.addColumn(
        'Tickets',
        'assigneeId',
        {
          type: Sequelize.STRING
        }
      )
    ])  
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Tickets',
      'state'
    ).then(() => {
      queryInterface.removeColumn(
        'Tickets',
        'assigneeId'
      )
    })
  }
}
