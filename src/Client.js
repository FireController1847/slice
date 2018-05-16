/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { AkairoClient } = require('discord-akairo');
const MongoDB = require('./MongoDB.js');
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

client.mongo = new MongoDB(client);

client.login(token);