const ce = require('embed-creator');
const { Command } = require('discord-akairo');

class Info extends Command {
  constructor() {
    super('info', {
      aliases: ['info'],
      description: 'The base command for getting information.',
      args: [
        {
          id: 'infoType',
          type: 'lowercase'
        },
        {
          id: 'content',
          match: 'rest'
        }
      ]
    });
  }
  exec(m, args) {
    if (!args.infoType) {
      return m.channel.send('Invalid Option. Please choose `bot`, `user`, `shard`, or `guild` (`server`). ' +
        `Example: \`${this.handler.prefix}${this.id} bot\``);
    } else if (args.infoType == 'user') {
      return this.handler._handleCommand(m, args.content, this.handler.modules.get('userinfo'));
    } else if (args.infoType == 'shard') {
      return this.handler._handleCommand(m, args.content, this.handler.modules.get('shardinfo'));
    } else if (args.infoType == 'bot') {
      return this.handler._handleCommand(m, args.content, this.handler.modules.get('botinfo'));
    } else if (['guild', 'server'].includes(args.infoType)) {
      return this.handler._handleCommand(m, args.content, this.handler.modules.get('guildinfo'));
    }
  }
}

module.exports = Info;