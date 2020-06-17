const Models = require('../../../models/'),
 TicketForm = Models.TicketForm

const Module = require('../module')
const FormCreator = require('./formCreator')

const checkPerm = require('../../util/checkPerm')
const getPrefix = require('../../util/getPrefix')
const printHelp = require('../../util/printHelp')
const selectForm = require('./util/selectForm')

class FormManager extends Module {

  onMessage(message, onlyPayload) {
    const formOp = onlyPayload.split(' ')[0]
    onlyPayload = onlyPayload.split(' ')
    onlyPayload.shift()
    onlyPayload = onlyPayload.join(' ')
    switch (formOp) {
      case 'create':
        this.createForm(message, onlyPayload)
        break
      case 'list':
        this.listForms(message)
        break
      case 'rename':
        this.renameForm(message)
        break
      case 'disable':
        this.disableForm(message)
        break
      case 'enable':
        this.enableForm(message)
        break
      case 'delete':
        this.deleteForm(message)
        break
      default:
        getPrefix(message).then(prefix => printHelp(message.channel, `${prefix}ticket form `, [
          {name: 'create', description: 'lets you create a new ticketForm and fill it with fields (in DMs)'},
          {name: 'list', description: 'lists all forms avaiable'},
          {name: 'rename', description: 'rename an existing form'},
          {name: 'disable', description: 'disables this form from being used to open tickets'},
          {name: 'enable', description: 'enables this form for being used to open tickets'},
          {name: 'delete', description: 'permanently removes a form and all its tickets'}
        ]))
        break
    }
  }

  createForm(message) {
    if (!checkPerm(message, 'MANAGE_GUILD')) { return }
    new FormCreator(message)
  }

  listForms(message) {
    selectForm(message.guild.id, message.channel)
  }

  async renameForm(message) {
    if (!checkPerm(message, 'MANAGE_GUILD')) { return }
    await message.channel.send('Please reply with the number of the form to rename:')
    const formId = await selectForm(message.guild.id, message.channel, message.author.id),
     form = await TicketForm.findOne({
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
    message.channel.awaitMessages(newNameMessage => newNameMessage.author.id === message.author.id, {max: 1}).then(async messages => {
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

module.exports = new FormManager()
