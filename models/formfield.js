
module.exports = (sequelize, DataTypes) => {
  const FormField = sequelize.define('FormField', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ticketFormId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {})
  FormField.associate = function(models) {
    // associations can be defined here
    FormField.belongsTo(models.TicketForm)
    FormField.hasMany(models.TicketField, {
      foreignKey: 'formFieldId',
      onDelete: 'CASCADE'
    })
  }
  return FormField
}
