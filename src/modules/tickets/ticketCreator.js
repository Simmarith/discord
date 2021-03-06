const Models = require('../../../models/'),
 Ticket = Models.Ticket,
 TicketField = Models.TicketField,
 TicketForm = Models.TicketForm
const selectForm = require('./util/selectForm.js')

class TicketCreator {

  constructor(message) {
    this.serverId = message.guild.id
    this.userId = message.member.id
    this.user = message.author
    this.ticketFields = []

    this.start()
  }

  async start() {
    this.channel = await this.user.createDM()
    if (this.ticketFormId == null) {
      await this.requestTicketForm()
    }

    this.form = await TicketForm.findOne({
      where: {
        id: this.ticketFormId
      }
    })
    this.formFields = await this.form.getFormFields()

    await this.fillFields()
    this.commit()
  }

  async requestTicketForm() {
    await this.channel.send('Please reply with the number for the Form you want to fill out.')
    this.ticketFormId = await selectForm(this.serverId, this.channel, this.userId)
  }

  async fillFields() {
    await this.channel.send('Please reply (text and links only) for the following fields:')
    for (let i = 0; i < this.formFields.length; i++) {
      await this.fillField(this.formFields[i])
    }
  }

  async fillField(formField) {
    await this.channel.send({
      embed: {
        fields: [{
          name: formField.name,
          value: formField.description
          }]
      }
    })
    await this.channel.awaitMessages(() => true, {max: 1}).then(messages => {
      this.ticketFields.push({
        formFieldId: formField.id,
        value: messages.first().content
      })  
    })
  }

  commit() {
    if (this.ticketFields.length == 0 || this.form == null) {
      this.user.send('Ticket could not be saved').then(() => this.user.deleteDM())
    }
    Ticket.create({
      serverId: this.serverId,
      userId: this.userId,
      ticketFormId: this.form.id
    }).then(ticket => {
      this.ticketFields.forEach(ticketField => {
        TicketField.create({
          ticketId: ticket.id,
          formFieldId: ticketField.formFieldId,
          value: ticketField.value
        })
      })
    })
    this.user.send('Ticket saved.')
    this.user.deleteDM()
  }

}

module.exports = TicketCreator
