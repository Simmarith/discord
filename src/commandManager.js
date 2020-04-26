const Prefix = require('../models/index.js').Prefix

class CommandManager {
  constructor(client) {
    this.client = client
    this.defaultPrefix = 's!'
    this.prefixes = {}
    this.commands = {
      'setPrefix': (message, onlyPayload) => {
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
      let prefix = await Prefix.findOrCreate({
        where: {
          serverId: message.guild.id
        },
        defaults: {
          value: this.defaultPrefix
        }
      })
      prefix = prefix[0]
      if (message.toString().search(prefix.value) === 0) {
        //find and execute the proper command handler
        const noPrefixMessage = message.toString().slice(prefix.value.length)
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
