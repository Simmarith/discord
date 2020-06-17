const Models = require('../../../models/'),
 TicketForm = Models.TicketForm,
 FormField = Models.FormField

class FormCreator {

  constructor(message) {
    this.serverId = message.guild.id
    this.user = message.author
    this.formFields = []

    this.start()
  }

  async start() {
    this.channel = await this.user.createDM()
    // We don't want awaitMessages to fetch this one
    await this.channel.send('Please enter the name for your new Form')
    await this.channel.awaitMessages(() => true, {max: 1}).then(messages => {
      this.formName = messages.first().content
      this.createFormFields()
    })
  }

  async createFormFields() {
    await this.user.send('I will now ask you about the fields this form is going to have.')
    // eslint-disable-next-line no-empty
    while(await this.createFormField()) {}
    this.commit()
  }

  async createFormField() {
    const formField = {}
    await this.channel.send('Please choose a name for this field')
    await this.channel.awaitMessages(() => true, {max: 1}).then(messages => {
      formField.name = messages.first().content  
    })
    await this.channel.send('Please choose a description for this field')
    await this.channel.awaitMessages(() => true, {max: 1}).then(messages => {
      formField.description = messages.first().content  
    })
    this.formFields.push(formField)
    await this.channel.send('Do you want to add another field?(y/N)')
    return this.channel.awaitMessages(() => true, {max: 1}).then(messages => {
      return messages.first().content === 'y'
    })
  }

  commit() {
    if (this.formName == null || this.formFields.length == 0) {
      this.channel.send('Couldn´t save form.').then(() => this.user.deleteDM())
      return
    }
    return TicketForm.create({
      serverId: this.serverId,
      name: this.formName
    }).then(ticketForm => {
      this.formFields.forEach(formField => {
        if (formField.name == null) {
          return
        }

        FormField.create({
          ticketFormId: ticketForm.id,
          name: formField.name,
          description: formField.description
        })
      })
    }).then(() => {
      this.channel.send('Form created.').then(() => {
        this.user.deleteDM()
      })
    })
  }

}

module.exports = FormCreator
