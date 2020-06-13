const Models = require('../../../../models')
const Ticket = Models.Ticket
const TicketForm = Models.TicketForm
/**
 * lets the user select a ticket out of all avaiable tickets for that server
 * @exports selectTicket
 *
 * @param {string} serverId
 * @param {object} channel sends and waits for messages in this channel
 * @param {string|null} selectBy wait for messages from this user. if left blank, no answer will be awaited
 * @param {string} state ticket state to filter by
 *
 * @return {string|null} ticketId of selected ticket (not verified!)
 */
module.exports = async (serverId, channel, selectBy, { state = 'open', user = null } = {}) => {
  const tickets = await Ticket.findAll({
    where: { serverId, state, assigneeId: user },
    include: [TicketForm]
  })

  await channel.send({
    embed: {
      fields: tickets.map(ticket => { return {
        name: ticket.id,
        value: `${ticket.TicketForm.name} by <@${ticket.userId}>${ ticket.assigneeId != null ? ` claimed by <@${ticket.assigneeId}>` : '' }` } 
      })
    }
  })

  if (selectBy != null) {
    return channel.awaitMessages((message) => message.author.id === selectBy, { max: 1 }).then(messages => messages.first().content)
  }
}
