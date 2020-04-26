const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('../secrets/token')
const CommandManager = require('./commandManager')
const talkBack = require('./commands/talkBack')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const commandManager = new CommandManager(client)
  commandManager.addCommand('talkBack', talkBack)
});

client.login(token);
