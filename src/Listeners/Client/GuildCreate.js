/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { Listener } = require('discord-akairo');

class ClientGuildCreate extends Listener {
  constructor() {
    super('clientGuildCreate', {
      emitter: 'client',
      event: 'guildCreate'
    });
  }

  exec(guild) {
    this.client.mongo.createGuild(guild.id);
  }
}

module.exports = ClientGuildCreate;