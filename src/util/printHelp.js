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
