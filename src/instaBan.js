const BannedName = require('../models/').BannedName

module.exports = (client) => {
  client.on('guildMemberAdd', member => {
    BannedName.count({
      where: {
        serverId: member.guild.id,
        name: member.user.username
      }
    }).then(occurences => {
      if (occurences !== 0) {
        member.ban({reason: 'found match in bannedNames'})
      }
    })
  })
}
