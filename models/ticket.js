
module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    serverId: DataTypes.STRING,
    userId: DataTypes.STRING,
    ticketFormId: DataTypes.STRING,
    assigneeId: DataTypes.STRING,
    state: DataTypes.ENUM('open', 'claimed', 'closed')
  }, {})
  Ticket.associate = function(models) {
    // associations can be defined here
    Ticket.belongsTo(models.TicketForm)
    Ticket.hasMany(models.TicketField, {
      foreignKey: 'ticketId'
    })
  }
  return Ticket
}
