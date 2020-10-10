const VoiceRole = require('../../models').VoiceRole
const checkPerm = require('../util/checkPerm')
const getPrefix = require('../util/getPrefix')

module.exports = async(message) => {
  if (!checkPerm(message, 'MANAGE_ROLES')) {
    return
  }

  const channel = message.mentions.channels.first()
  if (channel == null) {
    getPrefix(message).then(prefix => {
      message.channel.send(`\`${prefix}removeVoiceRoles <channel>\``)
    })
    return
  }

  const voiceRoles = await VoiceRole.findAll({
    where: {
      serverId: message.guild.id,
      channelId: channel.id
    }
  }),
  voiceRoleCount = voiceRoles.length
  voiceRoles.forEach(voiceRole => voiceRole.destroy())
  message.channel.send(`Deleted ${voiceRoleCount} voice role associations.`)
}
