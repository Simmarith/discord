const Prefix = require('../models/index.js').Prefix
const checkPerm = require('./util/checkPerm.js')
const getPrefix = require('./util/getPrefix.js')

class CommandManager {
constructor(client) {
  this.client = client
  this.defaultPrefix = 's!'
  this.prefixes = {}
  this.commands = {
    'setPrefix': (message, onlyPayload) => {
      if (!checkPerm(message, 'MANAGE_GUILD')) {
          return
        }
        if (onlyPayload === '') {
          message.channel.send('You gave me no new prefix!')
        } else {
          this.prefixes[message.guild.id] = onlyPayload
          Prefix.upsert({
            serverId: message.guild.id,
            value: onlyPayload
          }).then(() => {
            message.channel.send(`Prefix updated to \`${onlyPayload}\``)
          })
        }
      }
    }
    client.on('message', async message => {
      const prefix = await getPrefix(message)
      if (message.toString().search(prefix) === 0) {
        //find and execute the proper command handler
        const noPrefixMessage = message.toString().slice(prefix.length)
        const commandName = noPrefixMessage.split(' ')[0]
        let onlyPayload = noPrefixMessage.split(' ')
        onlyPayload.shift()
        onlyPayload = onlyPayload.join(' ')
        if (typeof this.commands[commandName] === 'function') {
          this.commands[commandName](message, onlyPayload)
        } else {
          message.channel.send('Invalid Command')
        }
      }
    })
  }

  addCommand(command, callback) {
    this.commands[command] = callback
  }
}

module.exports = CommandManager
