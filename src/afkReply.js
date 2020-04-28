const Nickname = require('../models/').Nickname

module.exports = (client) => {
  client.on('message', (message) => {
    if (message.author.bot) {
      return
    }
    message.mentions.members.forEach(member => {
      Nickname.findOne({
        where : {
          serverId: message.guild.id,
          userId: member.id
        }
      }).then(nick => {
        if (nick != null) {
          message.reply(`${member.user.username} is currently set to AFK. He might take a while to answer.`)
        }
      })
    })
  })
}
