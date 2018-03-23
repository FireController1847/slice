const { AkairoClient } = require('discord-akairo');
const path = require('path');
const { token } = require('./Data/Tokens.js');

const client = new AkairoClient({
  ownerID: '112732946774962176',
  prefix: 'sa$',
  allowMention: false,
  commandDirectory: path.join(__dirname, 'Commands'),
  listenerDirectory: path.join(__dirname, 'Inhibitors')
}, {
  disableEveryone: true
});
client.login(token);