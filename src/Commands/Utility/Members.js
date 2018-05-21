/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { Command } = require('discord-akairo');

class Members extends Command {
  constructor() {
    super('members', {
      aliases: ['members'],
      description: 'Returns the member count of the server.',
      typing: true
    });
  }
  exec(m) {
    return m.channel.send(`This server currently has ${m.guild.memberCount} members in it.`);
  }
}

module.exports = Members;