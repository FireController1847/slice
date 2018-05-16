/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { Command } = require('discord-akairo');

class DBDebug extends Command {
  constructor() {
    super('dbreset', {
      description: 'Resets the guild\'s settings.',
      typing: true,
      userPermissions: ['ADMINISTRATOR']
    });
  }
  async exec(m) {
    await this.client.mongo.guilds.deleteMany({ gid: m.guild.id });
    await this.client.mongo.createGuild(m.guild.id);
    return m.channel.send('Your guild\'s settings has successfully been reset.');
  }
}

module.exports = DBDebug;