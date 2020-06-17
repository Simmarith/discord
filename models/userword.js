
module.exports = (sequelize, DataTypes) => {
  const UserWord = sequelize.define('UserWord', {
    serverId: DataTypes.STRING,
    userId: DataTypes.STRING,
    word: DataTypes.STRING
  }, {})
  UserWord.associate = function(models) {
    // associations can be defined here
  }
  return UserWord
}
