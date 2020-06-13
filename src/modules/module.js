class Module {
  onMessage(message) {
    message.channel.send('This module has no commands')
  }
}

module.exports = Module
