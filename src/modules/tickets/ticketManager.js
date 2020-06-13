const Models = require('../../../models/')
const TicketForm = Models.TicketForm
const FormField = Models.FormField
const Ticket = Models.Ticket
const TicketField = Models.TicketField
const TicketRole = Models.TicketRole

const Module = require('../module.js')
const FormCreator = require('./formCreator')
const TicketCreator = require('./ticketCreator')

const checkPerm = require('../../util/checkPerm')
const getPrefix = require('../../util/getPrefix')
const printHelp = require('../../util/printHelp')
const selectForm = require('./util/selectForm')
const selectTicket = require('./util/selectTicket')

class TicketManager extends Module {
  onMessage(message, onlyPayload) {
    if (onlyPayload == '') {
      getPrefix(message).then(prefix => printHelp(message.channel, `${prefix}ticket `, [
        { name: 'open', description: 'open a new ticket (in DMs)' },
        { name: 'list', description: 'list all open tickets' },
        { name: 'claim', description: 'claim a ticket' },
        { name: 'show', description: 'shows one of your claimed tickets (in DMs)' },
        { name: 'release', description: 'release one of your claimed tickets back into the pool' },
        { name: 'close', description: 'close one of your tickets' },
        { name: 'role', params: '<role>', description: 'set the role which can work on tickets' },
        { name: 'form', params: '<command>', description: `operations for the forms; type \`${prefix}ticket form\` for more info` }
      ]))
      return
    }
    const ticketOp = onlyPayload.split(' ')[0]
    onlyPayload = onlyPayload.split(' ')
    onlyPayload.shift()
    onlyPayload = onlyPayload.join(' ')
    switch(ticketOp) {
      case 'open':
        this.createTicket(message)
        break;
      case 'list':
        this.listTickets(message)
        break;
      case 'claim':
        this.claimTicket(message)
        break;
      case 'show':
        this.showTicket(message)
        break;
      case 'release':
        this.releaseTicket(message)
        break;
      case 'close':
        this.closeTicket(message)
        break;
      case 'role':
        this.setRole(message, onlyPayload)
        break;
      case 'form':
        this.manageForm(message, onlyPayload)
        break;
      default:
        message.channel.send('Invalid ticket operation.')
        break;
    }
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

  async claimTicket(message) {
    if (!await this.hasTicketRole(message)) {
      message.channel.send('You are not allowed to use this command!')
      return
    }
    await message.channel.send('Reply with the number of the ticket you want to claim:')
    const ticketId = await selectTicket(message.guild.id, message.channel, message.author.id)
    Ticket.findOne({
      where: {
        id: ticketId,
        serverId: message.guild.id
      }
    })
      .then(ticket => {
        ticket.state = 'claimed'
        ticket.assigneeId = message.author.id
        ticket.save().then(() => { message.channel.send('Ticket claimed!') })
      })
      .catch(() => message.channel.send('couldn´t get ticket'))
  }

  async showTicket(message) {
    if (!await this.hasTicketRole(message)) {
      message.channel.send('You are not allowed to use this command!')
      return
    }
    await message.channel.send('Reply with the number of the ticket you want to read:')
    const ticketId = await selectTicket(message.guild.id, message.channel, message.author.id, { state: 'claimed', user: message.author.id })
    Ticket.findOne({
      where: {
        id: ticketId,
        serverId: message.guild.id
      },
      include: [ TicketForm, TicketField ]
    },)
      .then(async ticket => {
        if (ticket == null) {
          message.channel.send('Ticket not found => aborting')
          return
        }
        const fieldData = await Promise.all(ticket.TicketFields.map(ticket => ticket.getFormField()))
        let fields = ticket.TicketFields.map((ticketField, i) => { return {
          name: fieldData[i].name,
          value: ticketField.value != '' ? ticketField.value : '-'
        }})
        fields.unshift({ name: 'Ticket', value: `${ticket.TicketForm.name} by <@${ticket.userId}>` })
        const channel = await message.author.createDM()
        channel.send({
          embed: {
            fields
          }
        })
      })
  }

  async releaseTicket(message) {
    if (!await this.hasTicketRole(message)) {
      message.channel.send('You are not allowed to use this command!')
      return
    }
    await message.channel.send('Reply with the number of the ticket you want to release:')
    const ticketId = await selectTicket(message.guild.id, message.channel, message.author.id, { state: 'claimed', user: message.author.id})
    Ticket.findOne({
      where: {
        id: ticketId,
        serverId: message.guild.id,
        assigneeId: message.author.id
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

  async closeTicket(message) {
    if (!await this.hasTicketRole(message)) {
      message.channel.send('You are not allowed to use this command!')
      return
    }
    await message.channel.send('Reply with the number of the ticket you want to close:')
    const ticketId = await selectTicket(message.guild.id, message.channel, message.author.id, { state: 'claimed', user: message.author.id })
    Ticket.findOne({
      where: {
        id: ticketId,
        serverId: message.guild.id,
        assigneeId: message.author.id
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

  setRole(message, onlyPayload) {
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
    return message.member.roles.cache.array().find(role => role.id === ticketRole.roleId) !== undefined
  }

  manageForm(message, onlyPayload) {
    const formOp = onlyPayload.split(' ')[0]
    onlyPayload = onlyPayload.split(' ')
    onlyPayload.shift()
    onlyPayload = onlyPayload.join(' ')
    switch (formOp) {
      case 'create':
        this.createForm(message, onlyPayload)
        break;
      case 'list':
        this.listForms(message)
        break;
      case 'rename':
        this.renameForm(message)
        break;
      case 'disable':
        this.disableForm(message)
        break;
      case 'enable':
        this.enableForm(message)
        break;
      case 'delete':
        this.deleteForm(message)
        break;
      default:
        getPrefix(message).then(prefix => printHelp(message.channel, `${prefix}ticket form `, [
          { name: 'create', description: 'lets you create a new ticketForm and fill it with fields (in DMs)' },
          { name: 'list', description: 'lists all forms avaiable' },
          { name: 'rename', description: 'rename an existing form' },
          { name: 'disable', description: 'disables this form from being used to open tickets' },
          { name: 'enable', description: 'enables this form for being used to open tickets' },
          { name: 'delete', description: 'permanently removes a form and all it´s tickets' }
        ]))
        break;
    }
  }

  createForm(message, onlyPayload) {
    if (!checkPerm(message, 'MANAGE_GUILD')) { return }
    new FormCreator(message)
  }

  listForms(message) {
    selectForm(message.guild.id, message.channel)
  }

  async renameForm(message) {
    if (!checkPerm(message, 'MANAGE_GUILD')) { return }
    await message.channel.send('Please reply with the number of the form to rename:')
    const formId = await selectForm(message.guild.id, message.channel, message.author.id)
    const form = await TicketForm.findOne({
      where: {
        id: formId,
        serverId: message.guild.id
      }
    })
    if (form == null) {
      message.channel.send('Invalid selection => aborting')
      return
    }
    await message.channel.send('Please enter the new Name')
    message.channel.awaitMessages(newNameMessage => newNameMessage.author.id === message.author.id, { max: 1 }).then(async messages => {
      form.name = messages.first().content
      form.save()
        .then(() => message.channel.send('New form name set!'))
        .catch(() => message.channel.send('Error updating form'))
    })
  }

  async disableForm(message) {
    if (!checkPerm(message, 'MANAGE_GUILD')) { return }
    await message.channel.send('Please reply with the number of the form to disable:')
    const form = await TicketForm.findOne({
      where: {
        id: await selectForm(message.guild.id, message.channel, message.author.id),
        serverId: message.guild.id,
        state: 'active'
      }
    })
    if (form == null) {
      message.channel.send('Form not found => aborting')
      return
    }
    form.state = 'inactive'
    form.save()
      .then(() => message.channel.send('Form disabled.'))
      .catch(() => message.channel.send('Couldn´t disable form.'))
  }

  async enableForm(message) {
    if (!checkPerm(message, 'MANAGE_GUILD')) { return }
    await message.channel.send('Please reply with the number of the form to enable:')
    const form = await TicketForm.findOne({
      where: {
        id: await selectForm(message.guild.id, message.channel, message.author.id, 'inactive'),
        serverId: message.guild.id,
        state: 'inactive'
      }
    })
    if (form == null) {
      message.channel.send('Form not found => aborting')
      return
    }
    form.state = 'active'
    form.save()
      .then(() => message.channel.send('Form enabled.'))
      .catch(() => message.channel.send('Couldn´t enable form.'))
  }

  async deleteForm(message) {
    if (!checkPerm(message, 'MANAGE_GUILD')) { return }
    await message.channel.send('Please reply with the number of the form to delete:')
    const form = await TicketForm.findOne({
      where: {
        id: await selectForm(message.guild.id, message.channel, message.author.id, 'inactive'),
        serverId: message.guild.id,
        state: 'inactive'
      }
    })
    if (form == null) {
      message.channel.send('Form not found => aborting')
      return
    }

    form.destroy()
      .then(() => message.channel.send('Form deleted.'))
      .catch(() => message.channel.send('Couldn´t delete form.'))
  }
}

module.exports = new TicketManager()
