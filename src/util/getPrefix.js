const Prefix = require('../../models/index.js').Prefix

module.exports = async function (message) {
      const prefix = await Prefix.findOrCreate({
        where: {
          serverId: message.guild.id
        },
        defaults: {
          value: this.defaultPrefix
        }
      })
      return prefix[0].value
}
