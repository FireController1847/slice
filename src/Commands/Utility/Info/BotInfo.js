/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const ce = require('embed-creator');
const { version, Command } = require('discord-akairo');
const discord = require('discord.js');

class BotInfo extends Command {
  constructor() {
    super('botinfo', {
      description: 'Gives the user information about me!',
      typing: true
    });
  }
  async exec(m) {
    const app = await this.client.fetchApplication();
    return m.channel.send(ce(
      this.client.akairoOptions.colors.orange, null, 'Bot Information',
      'Here\'s some information about me!',
      [
        { name: ':1234: Version', value: 'Version 2A' },
        { name: ':tools: Owner', value: `${app.owner.tag} (${app.owner.id})` },
        { name: ':books: Library', value: `I was coded using Akairo ${version} with Discord.js ${discord.version} on Node.js ${process.version}.` },
        { name: ':desktop: Host', value: 'Running on Ubuntu 16.04 using the Wholesale platform. Currently using the Dual Intel Xeon 5420 Preconfigured plan for 30$/month.' },
        { name: ':map: Location', value: 'Kansas City, Missouri, USA.' }
      ]
    ));
  }
}

module.exports = BotInfo;