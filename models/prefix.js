
module.exports = (sequelize, DataTypes) => {
  const Prefix = sequelize.define('Prefix', {
    serverId: {type: DataTypes.STRING, primaryKey: true},
    value: DataTypes.STRING
  }, {})
  Prefix.associate = function(models) {
    // associations can be defined here
  }
  return Prefix
}
