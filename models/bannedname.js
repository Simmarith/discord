'use strict';
module.exports = (sequelize, DataTypes) => {
  const BannedName = sequelize.define('BannedName', {
    serverId: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  BannedName.associate = function(models) {
    // associations can be defined here
  };
  return BannedName;
};