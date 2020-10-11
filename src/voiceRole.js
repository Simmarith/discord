const VoiceRole = require('../models/').VoiceRole
const RoleManager = require('./util/RoleManager')

module.exports = (client) => {
  client.on('voiceStateUpdate', async(oldState, newState) => {
    let user = ''
    const roleDiff = {
      add: [],
      remove: []
    }
    if (oldState.channelID != null) {
      const voiceRoles = await VoiceRole.findAll({
        where: {
          serverId: oldState.guild.id,
          channelId: oldState.channelID
        }
      })

      voiceRoles.forEach((voiceRole) => {
        user = oldState.member
        roleDiff.remove.push(voiceRole.roleId)
      })
    }

    if (newState.channelID != null) {
      const voiceRoles = await VoiceRole.findAll({
        where: {
          serverId: newState.guild.id,
          channelId: newState.channelID
        }
      })

      voiceRoles.forEach((voiceRole) => {
        user = newState.member
        roleDiff.add.push(voiceRole.roleId)
      })
    }

    if (roleDiff.add.length !== 0 || roleDiff.remove.length !== 0) {
      RoleManager.changeRoles(user, roleDiff)
    }
  })
}
