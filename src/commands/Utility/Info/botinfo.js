/* eslint-disable max-len */
const ce = require('embed-creator');
const { colors } = require('../../../util/Config.js');
const Command = require('../../../structures/Command.js');
const discord = require('discord.js');

class BotInfo extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'BOT_INFO',
      desc: 'Gives the user information about me!'
    });
  }
  async execute(m) {
    this.start(m.channel);
    if (!m.ep) {
      this.end(m.channel);
      return m.errors.cantEmbedLinks();
    }
    let app;
    try {
      app = await this.client.fetchApplication();
    } catch (e) {
      this.end(m.channel);
      return m.errors.internalError(e);
    }
    this.end(m.channel);
    return m.channel.send(ce(
      colors.orange, null, 'Bot Information',
      'Here\'s some information about me!',
      [
        { name: ':1234: Version', value: 'Version 2' },
        { name: ':tools: Owner', value: `${app.owner.tag} (${app.owner.id})` },
        { name: ':books: Library', value: `I was coded using Discord.js ${discord.version} on Node.js ${process.version}.` },
        { name: ':desktop: Host', value: 'Running on Ubuntu 16.04 using the Wholesale platform. Currently using the Dual Intel Xeon 5420 Preconfigured plan for 30$/month.' },
        { name: ':map: Location', value: 'Kansas City, Missouri, USA.' }
      ]
    ));
  }
}

module.exports = BotInfo;