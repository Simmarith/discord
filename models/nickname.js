
module.exports = (sequelize, DataTypes) => {
  const Nickname = sequelize.define('Nickname', {
    serverId: DataTypes.STRING,
    userId: DataTypes.STRING,
    value: DataTypes.STRING
  }, {})
  Nickname.associate = function(models) {
    // associations can be defined here
  }
  return Nickname
}
