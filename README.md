 Simmarith.com Discord Bot
the discord bot tacked onto simmarith.com

## Installation
- clone secrets/token.js.example to secrets/token.js and fill in your bot token
- npm install
- npx sequelize-cli db:migrate

You could probably use this bot in a docker container pretty easily as well - maybe someone wants to create a PR with a Dockerfile?

## How to run

You can run this bot with `npm start` or by running `src/index.js` through node yourself. I'd suggest to use this bot with pm2 for easy logging and restarts. 

## Additional Notes

this bot will create a sqlite3 db on your root directory and store all persistent data in there. I'd suggest creating a backup of that file regularly if you value your data. If you'd rather use you own DB you can do that as well. I'm using sequelize as an ORM. Settings for which DB to use are stored in config/config.json. Tread at your own risk, as I've not tested changing DBs at all.
