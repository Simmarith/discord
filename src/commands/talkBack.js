const getPrefix = require('../util/getPrefix')

module.exports = function(message, onlyPayload) {
  if (onlyPayload === '') {
    getPrefix(message).then(prefix => message.channel.send(`\`${prefix}talkBack <message>\``))
  } else {
    message.channel.send(onlyPayload)
  }
} 
