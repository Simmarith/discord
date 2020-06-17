const BannedName = require('../../models').BannedName
const checkPerm = require('../util/checkPerm')
const getPrefix = require('../util/getPrefix')

module.exports = async(message, payloadOnly) => {
  if (!checkPerm(message, 'BAN_MEMBERS')) {
    return
  }

  const name = payloadOnly.substr(payloadOnly.indexOf(' ') + 1)
  if (name == '') {
    getPrefix(message).then(prefix => {
      message.channel.send(`\`${prefix}unbanName <name>\``)
    })
    return
  }

  const names = await BannedName.findAll({
    where: {
      serverId: message.guild.id,
      name
    }
  }),
   namesCount = names.length
  names.forEach(name => name.destroy())
  message.channel.send(`Deleted ${namesCount} banned names.`)
}
