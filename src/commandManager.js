class CommandManager {
  constructor(client) {
    this.client = client
    this.commands = {}
    this.prefix = 's!'
    client.on('message', message => {
      if (message.toString().search(prefix) === 0) {
        //find and execute the proper command handler
        const noPrefixMessage = message.toString().slice(this.prefix.length - 1)
        let onlyPayload = noPrefixMessage.split(' ')
        onlyPayload.shift()
        onlyPayload = onlyPayload.join(' ')
        this.commands[noPrefixMessage.split(' ')[0]](message, onlyPayload)
      }
    })
  }

  addCommand(command, callback) {
    this.commands = callback
  }
}

module.exports = CommandManager
