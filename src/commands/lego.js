const getPrefix = require('../util/getPrefix')

module.exports = function (message, onlyPayload) {
  if (!/^\d{4,5}$/.test(onlyPayload)) {
    getPrefix(message).then(prefix => message.channel.send(`\`${prefix}lego <inventory number>\``))
  } else {
    message.channel.send(`https://www.lego.com/en-us/product/${onlyPayload}`)
  }
} 
