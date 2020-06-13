const TicketForm = require('../../../../models/').TicketForm
/**
 * lets the user select a form out of all avaiable forms for that server
 * @exports selectForm
 *
 * @param {string} serverId
 * @param {object} channel sends and waits for messages in this channel
 * @param {string|null} selectBy wait for messages from this user. if left blank, no answer will be awaited
 * @param {string} state the state of the form - defaults to 'active'
 *
 * @return {string|null} ticketFormId of selected ticketForm (not verified!)
 */
module.exports = async (serverId, channel, selectBy, state = 'active') => {
  const forms = await TicketForm.findAll({
    where: { serverId, state }
  })

  await channel.send({
    embed: {
      fields: forms.map(form => { return { name: form.id, value: form.name }})
    }
  })

  if (selectBy != null) {
    return channel.awaitMessages((message) => message.author.id === selectBy, { max: 1 }).then(messages => messages.first().content)
  }
}
