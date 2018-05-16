/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { Listener } = require('discord-akairo');

class ClientReady extends Listener {
  constructor() {
    super('clientReady', {
      emitter: 'client',
      event: 'ready'
    });
  }

  exec() {
    this.client.user.setActivity(`${this.client.akairoOptions.prefix}help`, {
      url: 'https://www.twitch.tv/monstercat/',
      type: 'STREAMING'
    });
    console.log(`Online and ready! This shard is on ${this.client.guilds.size} guilds.`);
  }
}

module.exports = ClientReady;