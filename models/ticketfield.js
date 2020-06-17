
module.exports = (sequelize, DataTypes) => {
  const TicketField = sequelize.define('TicketField', {
    ticketId: DataTypes.STRING,
    formFieldId: DataTypes.STRING,
    value: DataTypes.STRING
  }, {})
  TicketField.associate = function(models) {
    // associations can be defined here
    TicketField.belongsTo(models.Ticket)
    TicketField.belongsTo(models.FormField)
  }
  return TicketField
}
