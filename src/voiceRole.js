const VoiceRole = require('../models/').VoiceRole

module.exports = (client) => {
  client.on('voiceStateUpdate', async(oldState, newState) => {
    if (oldState.channelID != null) {
      const voiceRoles = await VoiceRole.findAll({
        where: {
          serverId: oldState.guild.id,
          channelId: oldState.channelID
        }
      })

      const rolesToRemove = []

      voiceRoles.forEach(async(voiceRole) => {
        rolesToRemove.push(oldState.guild.roles.fetch(voiceRole.roleId))
      })

      oldState.member.roles.remove(await Promise.all(rolesToRemove))
    }

    if (newState.channelID != null) {
      const voiceRoles = await VoiceRole.findAll({
        where: {
          serverId: newState.guild.id,
          channelId: newState.channelID
        }
      })

      const rolesToAdd = []

      voiceRoles.forEach(async(voiceRole) => {
        rolesToAdd.push(newState.guild.roles.fetch(voiceRole.roleId))
      })

      oldState.member.roles.add(await Promise.all(rolesToAdd))
    }
  })
}
