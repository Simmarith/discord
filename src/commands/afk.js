const Nickname = require('../../models/').Nickname
const getPrefix = require('../util/getPrefix')

module.exports = async (message) => {
  const nick = await Nickname.findOne({
    where: {
      serverId: message.guild.id,
      userId: message.member.id
    }
  })
  if (nick != null) {
    message.member.setNickname(nick.value, 'afk deactivated')
    message.channel.send('AFK deactivated.')
    nick.destroy()
  } else {
    Nickname.create({
      serverId: message.guild.id,
      userId: message.member.id,
      value: message.member.nickname
    })
    let newNick = (message.member.nickname == null) ? message.author.username : message.member.nickname
    newNick = '[AFK]' + newNick
    message.member.setNickname(
      newNick,
      'afk activated')
      .catch(() => message.channel.send('I am not privileged enough to change your nickname.'))
    message.channel.send('AFK activated')
  }
}
