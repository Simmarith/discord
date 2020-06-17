
module.exports = (sequelize, DataTypes) => {
  const TicketRole = sequelize.define('TicketRole', {
    serverId: {type: DataTypes.STRING, primaryKey: true},
    roleId: DataTypes.STRING
  }, {})
  TicketRole.associate = function(models) {
    // associations can be defined here
  }
  return TicketRole
}
