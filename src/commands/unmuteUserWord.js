const UserWord = require('../../models').UserWord
const checkPerm = require('../util/checkPerm')
const getPrefix = require('../util/getPrefix')

module.exports = async (message) => {
  if (!checkPerm(message, 'MANAGE_MESSAGES') || message.author.bot) {
    return
  }

  const user = message.mentions.members.first()
  if (user == null) {
    getPrefix(message).then(prefix => {
      message.channel.send(`\`${prefix}unmuteUserWord <user>\``)
    })
    return
  }

  const words = await UserWord.findAll({
    where: {
      serverId: message.guild.id,
      userId:  user.id
    }
  })
  const wordsCount = words.length
  words.forEach(word => word.destroy())
  message.channel.send(`Deleted ${wordsCount} restrictions.`)
}
