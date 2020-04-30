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
      return
    }

    // check embeds
    function hasWordInEmbed(embed, word) {
      const relevantStrings = [
        embed.title,
        embed.footer.text
      ]
      embed.fields.forEach(field => {
        relevantStrings.push(field.name)
        relevantStrings.push(field.value)
      })
      return (relevantStrings.find(line => (line.indexOf(word.word) !== -1)) !== undefined)
    }
    if (message.embeds != null) {
      if (message.embeds.find(embed => {
        return words.find(word => hasWordInEmbed(embed, word)) !== undefined
      }) !== undefined) {
        message.delete()
      }
    }
  } 

  client.on('message', checkMessage)
} 

