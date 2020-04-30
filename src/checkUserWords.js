const UserWord = require('../models').UserWord

module.exports = (client) => {
  async function checkMessage (message) {
    const words = await UserWord.findAll({
      where: {
        serverId: message.guild.id,
        userId: message.member.id
      }
    })

    if (words.length === 0) {
      return
    }

    if (words.find(word => (message.content.indexOf(word.word) !== -1)) !== undefined) {
      message.delete()
    }
  }

  client.on('message', checkMessage)
} 

