const getPrefix = require('../util/getPrefix')
const checkPerm = require('../util/checkPerm')

module.exports = async (message, payloadOnly) => {
  if (!checkPerm(message, 'MANAGE_MESSAGES') || message.author.bot) {
    return
  }
  if (!/^\d+$/.test(payloadOnly)) {
    getPrefix(message).then(prefix => {
      message.channel.send(`\`${prefix}deleteAttachments <number>\``)
    })
    return
  }
  const lastMessages = await message.channel.messages.fetch()
  const attachmentMessages = lastMessages.filter(message => message.attachments.array().length)
  attachmentMessages.array().splice(0, parseInt(payloadOnly)).forEach(message => message.delete())
}
