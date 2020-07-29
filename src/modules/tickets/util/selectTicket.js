const Models = require('../../../../models'),
 Ticket = Models.Ticket,
 TicketForm = Models.TicketForm
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
module.exports = async(serverId, channel, selectBy, {state = 'open', user = null} = {}) => {
  const tickets = await Ticket.findAll({
    where: {serverId, state, assigneeId: user},
    include: [TicketForm]
  })

  if (tickets.length === 0) {
    await channel.send('No tickets found')
    return null
  }

  const fields = await Promise.all(tickets.map(ticket => {
    const form = (ticket.TicketForm == null) ? {} : ticket.TicketForm
    return channel.guild.members.fetch(ticket.userId)
      .then(guildMember => {
        const creator = (guildMember == null) ? {} : guildMember.user
        return {
          name: ticket.id,
          value: `${form.name} by <@!${creator.id}>(${creator.username}#${creator.discriminator})${ticket.assigneeId != null ? ` claimed by <@${ticket.assigneeId}>` : ''}`} 
      })
      .catch(() => {
        return {
          name: ticket.id,
          value: `${form.name} by \`user not found\`${ticket.assigneeId != null ? ` claimed by <@${ticket.assigneeId}>` : ''}`} 
      })
  }))


  await channel.send({
    embed: {
      fields
    }
  })

  if (selectBy != null) {
    return channel.awaitMessages((message) => message.author.id === selectBy, {max: 1}).then(messages => messages.first().content)
  }
}
