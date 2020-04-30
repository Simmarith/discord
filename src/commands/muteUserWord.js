const UserWord = require('../../models/').UserWord
const checkPerm = require('../util/checkPerm')
const getPrefix = require('../util/getPrefix')

module.exports = (message, payloadOnly) => {
  if (!checkPerm(message, 'MANAGE_MESSAGES') || message.author.bot) {
    return
  }
  const user = message.mentions.members.first()
  const word = payloadOnly.substr(payloadOnly.indexOf(' ') + 1)
  if (user == null || word === '') {
    getPrefix(message).then(prefix => {
      message.channel.send(`\`${prefix}muteUserWord <user> <word(-s)>\``)
    })
    return
  }
  UserWord.create({
    serverId: message.guild.id,
    userId: user.id,
    word
  }).then(() => {
    message.channel.send(`${user} will now be prevented from saying \`${word}\``)
  })
}
