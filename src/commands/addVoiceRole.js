const VoiceRole = require('../../models/').VoiceRole
const checkPerm = require('../util/checkPerm')
const getPrefix = require('../util/getPrefix')

module.exports = (message) => {
  if (!checkPerm(message, 'MANAGE_ROLES') || message.author.bot) {
    return
  }
  const channel = message.mentions.channels.first()
  const role = message.mentions.roles.first()
  if (channel == null || role == null) {
    getPrefix(message).then(prefix => {
      message.channel.send(`\`${prefix}addVoiceRole <channel> <role>\``)
    })
    return
  }
  VoiceRole.create({
    serverId: message.guild.id,
    channelId: channel.id,
    roleId: role.id
  }).then(() => {
    message.channel.send(`Users in ${channel} will now be given ${role} during their stay`)
  })
}
