/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { Command } = require('discord-akairo');

class Eval extends Command {
  constructor() {
    super('eval', {
      aliases: ['eval'],
      ownerOnly: true,
      args: [
        {
          id: 'content',
          match: 'content'
        }
      ]
    });
  }
  exec(m, args) {
    try {
      return m.channel.send(`\`\`\`js\n${eval(args.content)}\n\`\`\``);
    } catch (e) {
      return m.channel.send(`\`\`\`js\n${e}\n\`\`\``);
    }
  }
}

module.exports = Eval;