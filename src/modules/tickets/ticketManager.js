const Models = require('../../../models/'),
 TicketForm = Models.TicketForm,
 Ticket = Models.Ticket,
 TicketField = Models.TicketField,
 TicketRole = Models.TicketRole

const Module = require('../module')
const formManager = require('./formManager')
const TicketCreator = require('./ticketCreator')

const checkPerm = require('../../util/checkPerm')
const getPrefix = require('../../util/getPrefix')
const printHelp = require('../../util/printHelp')
const selectTicket = require('./util/selectTicket')

class TicketManager extends Module {

  onMessage(message, onlyPayload) {
    if (onlyPayload == '') {
      this.printHelp(message)
      return
    }
    const ticketOp = onlyPayload.split(' ')[0]
    onlyPayload = onlyPayload.split(' ')
    onlyPayload.shift()
    onlyPayload = onlyPayload.join(' ')
    switch(ticketOp) {
      case 'open':
        this.createTicket(message)
        break
      case 'list':
        this.listTickets(message)
        break
      case 'claim':
        this.claimTicket(message, onlyPayload)
        break
      case 'show':
        this.showTicket(message, onlyPayload)
        break
      case 'release':
        this.releaseTicket(message, onlyPayload)
        break
      case 'close':
        this.closeTicket(message, onlyPayload)
        break
      case 'role':
        this.setRole(message, onlyPayload)
        break
      case 'form':
        this.manageForm(message, onlyPayload)
        break
      case 'help':
        this.printHelp(message)
        break
      default:
        message.channel.send('Invalid ticket operation.')
        break
    }
  }

  printHelp(message) {
    return getPrefix(message).then(prefix => printHelp(message.channel, `${prefix}ticket `, [
      {name: 'help', description: 'print this help'},
      {name: 'open', description: 'open a new ticket (in DMs)'},
      {name: 'list', description: 'list all open tickets'},
      {name: 'claim', params: '<ticketId>', description: 'claim a ticket'},
      {name: 'show', params: '<ticketId>', description: 'shows one of your claimed tickets (in DMs)'},
      {name: 'release', params: '<ticketId>', description: 'release one of your claimed tickets back into the pool'},
      {name: 'close', params: '<ticketId>', description: 'close one of your tickets'},
      {name: 'role', params: '<role>', description: 'set the role which can work on tickets'},
      {name: 'form', params: '<command>', description: `operations for the forms; type \`${prefix}ticket form\` for more info`}
    ]))
  }

  createTicket(message) {
    new TicketCreator(message)
  }

  async listTickets(message) {
    if (!await this.hasTicketRole(message)) {
      message.channel.send('You are not allowed to use this command!')
      return
    }
    selectTicket(message.guild.id, message.channel, false)
  }

  async claimTicket(message, onlyPayload) {
    if (!await this.hasTicketRole(message)) {
      message.channel.send('You are not allowed to use this command!')
      return
    }
    let ticketId = null
    if (/^\d+$/.test(onlyPayload)) {
      ticketId = onlyPayload
    } else {
      await message.channel.send('Reply with the number of the ticket you want to claim:')
      ticketId = await selectTicket(message.guild.id, message.channel, message.member.id)
    }
    if (ticketId == null) { return message.channel.send('=> aborting') }
    Ticket.findOne({
      where: {
        id: ticketId,
        serverId: message.guild.id
      }
    })
      .then(ticket => {
        ticket.state = 'claimed'
        ticket.assigneeId = message.member.id
        ticket.save().then(() => { message.channel.send('Ticket claimed!') })
      })
      .catch(() => message.channel.send('couldn´t get ticket'))
  }

  async showTicket(message, onlyPayload) {
    if (!await this.hasTicketRole(message)) {
      message.channel.send('You are not allowed to use this command!')
      return
    }
    let ticketId = null
    if (/^\d+$/.test(onlyPayload)) {
      ticketId = onlyPayload
    } else {
      await message.channel.send('Reply with the number of the ticket you want to read:')
      ticketId = await selectTicket(message.guild.id, message.channel, message.member.id, {state: 'claimed', user: message.member.id})
      if (ticketId == null) { return message.channel.send('=> aborting') }
    }
    Ticket.findOne({
      where: {
        id: ticketId,
        serverId: message.guild.id,
        assigneeId: message.member.id
      },
      include: [TicketForm, TicketField]
    },)
      .then(async ticket => {
        if (ticket == null) {
          message.channel.send('Ticket not found => aborting')
          return
        }
        const fieldData = await Promise.all(ticket.TicketFields.map(ticket => ticket.getFormField()))
        const fields = ticket.TicketFields.map((ticketField, i) => {
          return {
            name: fieldData[i].name,
            value: ticketField.value != '' ? ticketField.value : '-'
          }
        })
        fields.unshift({name: 'Ticket', value: `${ticket.TicketForm.name} by <@${ticket.userId}>`})
        const channel = await message.author.createDM()
        channel.send({
          embed: {
            fields
          }
        })
      })
  }

  async releaseTicket(message, onlyPayload) {
    if (!await this.hasTicketRole(message)) {
      message.channel.send('You are not allowed to use this command!')
      return
    }
    let ticketId = null
    if (/^\d+$/.test(onlyPayload)) {
      ticketId = onlyPayload
    } else {
      await message.channel.send('Reply with the number of the ticket you want to release:')
      ticketId = await selectTicket(message.guild.id, message.channel, message.member.id, {state: 'claimed', user: message.member.id})
    }
    if (ticketId == null) { return message.channel.send('=> aborting') }
    Ticket.findOne({
      where: {
        id: ticketId,
        serverId: message.guild.id,
        assigneeId: message.member.id
      }
    })
      .then(ticket => {
        if (ticket == null) {
          message.channel.send('Ticket not found => aborting')
          return
        }
        ticket.state = 'open'
        ticket.assigneeId = null
        ticket.save().then(() => { message.channel.send('Ticket released!') })
      })
      .catch(() => message.channel.send('couldn´t release ticket'))
  }

  async closeTicket(message, onlyPayload) {
    if (!await this.hasTicketRole(message)) {
      message.channel.send('You are not allowed to use this command!')
      return
    }
    let ticketId = null
    if (/^\d+$/.test(onlyPayload)) {
      ticketId = onlyPayload
    } else {
      await message.channel.send('Reply with the number of the ticket you want to close:')
      ticketId = await selectTicket(message.guild.id, message.channel, message.member.id, {state: 'claimed', user: message.member.id})
    }
    if (ticketId == null) { return message.channel.send('=> aborting') }
    Ticket.findOne({
      where: {
        id: ticketId,
        serverId: message.guild.id,
        assigneeId: message.member.id
      }
    })
      .then(ticket => {
        if (ticket == null) {
          message.channel.send('Ticket not found => aborting')
          return
        }
        ticket.state = 'closed'
        ticket.assigneeId = null
        ticket.save().then(() => { message.channel.send('Ticket closed!') })
      })
      .catch(() => message.channel.send('couldn´t close ticket'))
  }

  setRole(message) {
    if (!checkPerm(message, 'MANAGE_GUILD')) { return }
    if (message.mentions.roles.array().length === 0) {
      message.channel.send('You need to specify a role!')
      return
    }
    const roleId = message.mentions.roles.first().id
    TicketRole.upsert({
      serverId: message.guild.id,
      roleId
    })
      .then(() => message.channel.send('Role updated Successfully!'))
      .catch(() => message.channel.send('Could not update TicketRole!'))
  }

  async hasTicketRole(message) {
    const ticketRole = await TicketRole.findByPk(message.guild.id)
    if (ticketRole == null) {
      return false
    }
    return message.member.roles.cache.array().find(role => role.id === ticketRole.roleId) !== undefined
  }

  manageForm(message, onlyPayload) {
    formManager.onMessage.bind(formManager)(message, onlyPayload)
  }

}

module.exports = new TicketManager()
