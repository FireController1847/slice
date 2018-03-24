const { AkairoClient } = require('discord-akairo');
const path = require('path');
const { token } = require('./Data/Tokens.js');

const client = new AkairoClient({
  ownerID: '112732946774962176',
  prefix: 'sa$',
  allowMention: true,
  emitters: { process },
  commandDirectory: path.join(__dirname, 'Commands'),
  listenerDirectory: path.join(__dirname, 'Listeners'),
  // Custom Options
  colors: {
    orange: '#FE8B00'
  }
}, {
  disableEveryone: true
});

client.login(token);