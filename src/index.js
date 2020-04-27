const Sequelize = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database.sqlite3'
});
const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('../secrets/token')
const CommandManager = require('./commandManager')
const talkBack = require('./commands/talkBack')
const afk = require('./commands/afk')

sequelize
  .authenticate()
  .then(() => {
    console.log('Database Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const commandManager = new CommandManager(client)
  commandManager.addCommand('talkBack', talkBack)
  commandManager.addCommand('afk', afk)
});

client.login(token);
