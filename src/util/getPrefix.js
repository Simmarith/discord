const Prefix = require('../../models/').Prefix
const defaultPrefix = 's!'

module.exports = async (message) => {
  if (message.guild == null) {
    return null
  }
  const prefix = await Prefix.findOrCreate({
    where: {
      serverId: message.guild.id
    },
    defaults: {
      value: defaultPrefix
    }
  })
  return prefix[0].value
}
