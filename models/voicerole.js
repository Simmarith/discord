const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class VoiceRole extends Model {

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    /**
     * static associate(models) {
     * }
     */

  }
  VoiceRole.init({
    serverId: DataTypes.STRING,
    channelId: DataTypes.STRING,
    roleId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'VoiceRole',
  })
  return VoiceRole
}
