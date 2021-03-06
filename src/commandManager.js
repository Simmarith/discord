const Prefix = require('../models/').Prefix
const checkPerm = require('./util/checkPerm')
const getPrefix = require('./util/getPrefix')

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
          getPrefix(message).then(prefix => message.channel.send(`\`${prefix}setPrefix <prefix>\``))
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
      if ((prefix != null) && (message.toString().search(prefix) === 0)) {
        // find and execute the proper command handler
        const noPrefixMessage = message.toString().slice(prefix.length),
         commandName = noPrefixMessage.split(' ')[0]
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

  addModule(command, module) {
    this.commands[command] = module.onMessage.bind(module)
  }

}

module.exports = CommandManager
