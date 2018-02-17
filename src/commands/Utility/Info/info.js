const Command = require('../../../structures/Command.js');

class Info extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'info',
      desc: 'A hub for all information commands. Includes bot, user, and guild.'
    });
  }
  execute(m) {
    if (m.argsLower[1] == 'bot') {
      return this.client.commands.get('BOT_INFO').execute(m);
    } else if (m.argsLower[1] == 'user') {
      return this.client.commands.get('USER_INFO').execute(m);
    } else if (m.argsLower[1] == 'shard') {
      return this.client.commands.get('SHARD_INFO').execute(m);
    } else if (['guild', 'server'].includes(m.argsLower[1])) {
      return this.client.commands.get('GUILD_INFO').execute(m);
    }
    this.start(m.channel);
    this.end(m.channel);
    return m.channel.send('INVALID OPTION: Choose `bot`, `user`, `shard`, or `guild` (`server`). ' +
      `Example: \`${m.prefix}${this.name} bot\`.`);
  }
}

module.exports = Info;