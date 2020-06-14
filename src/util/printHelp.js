/**
 * print a formatted help embed
 * @exports printHelp
 *
 * @param {object} channel the discordJs channel object to send the message to
 * @param {string} base the command base to put in front of the commands
 * @param {Object[]} helpTopics an array of topics
 * @param {string} helpTopics[].name the actual command
 * @param {string} helpTopics[].params parameters that can be added to this command (optional)
 * @param {string} helpTopics[].description further explanation for that command, will be appended
 */
module.exports = (channel, base, helpTopics) => {
  channel.send({
    embed: {
      fields: helpTopics.map(topic => {
        return {
          name: topic.name,
          value: `\`${base}${topic.name}${ topic.params != null ? ` ${topic.params}` : '' }\`${ topic.description ? `: ${topic.description}` : '' }`
        }
      })
    }
  })
}
