const BannedName = require('../../models/').BannedName
const checkPerm = require('../util/checkPerm')
const getPrefix = require('../util/getPrefix')

module.exports = (message, payloadOnly) => {
  if (!checkPerm(message, 'BAN_MEMBERS')) {
    return
  }
  const name = payloadOnly.substr(payloadOnly.indexOf(' ') + 1)
  if (name === '') {
    getPrefix(message).then(prefix => {
      message.channel.send(`\`${prefix}banName <name>\``)
    })
    return
  }
  BannedName.create({
    serverId: message.guild.id,
    name
  }).then(() => {
    message.channel.send(`${name} is now banned`)
  })
}
