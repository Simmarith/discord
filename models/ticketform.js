'use strict';
module.exports = (sequelize, DataTypes) => {
  const TicketForm = sequelize.define('TicketForm', {
    serverId: DataTypes.STRING,
    name: DataTypes.STRING,
    state: DataTypes.ENUM('active', 'inactive')
  }, {});
  TicketForm.associate = function(models) {
    // associations can be defined here
    TicketForm.hasMany(models.FormField, {
      foreignKey: 'ticketFormId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
    TicketForm.hasMany(models.Ticket, {
      foreignKey: 'ticketFormId'
    })
  };
  return TicketForm;
};
