/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { Command } = require('discord-akairo');

class Unload extends Command {
  constructor() {
    super('unload', {
      aliases: ['unload'],
      ownerOnly: true,
      args: [
        {
          id: 'commandID'
        }
      ]
    });
  }
  exec(m, args) {
    if (!args.commandID) {
      return m.channel.send('You must include a command ID!');
    }
    this.handler.remove(args.commandID);
    return m.channel.send(`Removed command \`${args.commandID}\`.`);
  }
}

module.exports = Unload;