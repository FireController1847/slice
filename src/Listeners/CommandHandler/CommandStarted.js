/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { Listener } = require('discord-akairo');

class CommandHandlerCommandStarted extends Listener {
  constructor() {
    super('commandHandlerCommandStarted', {
      emitter: 'commandHandler',
      event: 'commandStarted'
    });
  }

  exec(m, c) {
    if (['info', 'database'].includes(c.id)) return;
    if (m.guild) console.log(`User ${m.author.username} (${m.author.id}) issued server command ${this.client.akairoOptions.prefix}${c.id} in ${m.guild.name} (${m.guild.id}), #${m.channel.name}`);
    else console.log(`User ${m.author.username} (${m.author.id}) issued private command ${this.client.akairoOptions.prefix}${c.id}.`);
  }
}

module.exports = CommandHandlerCommandStarted;