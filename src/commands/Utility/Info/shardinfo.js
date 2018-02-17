/* eslint-disable max-len */
const ce = require('embed-creator');
const { colors } = require('../../../util/Config.js');
const Command = require('../../../structures/Command.js');
const pms = require('pretty-ms');

class ShardInfo extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'SHARD_INFO',
      desc: 'Gives information about what part of me is on your server!'
    });
  }
  execute(m) {
    this.start(m.channel);
    if (!m.ep) {
      this.end(m.channel);
      return m.errors.cantEmbedLinks();
    }
    this.end(m.channel);
    return m.channel.send(ce(
      colors.orange, null, 'Shard Information',
      'Here\'s some information about the part of me that\'s on your server!',
      [
        { inline: true, name: ':1234: Total Shards', value: this.client.shard.count },
        { inline: true, name: ':hash: Shard ID', value: this.client.shard.id },
        { inline: true, name: ':minidisc: Shard Guilds', value: this.client.guilds.size },
        { inline: true, name: ':speech_balloon: Shard Channels', value: this.client.channels.size },
        { inline: true, name: ':person_with_blond_hair: Shard Users', value: this.client.users.size },
        { inline: true, name: ':globe_with_meridians: Shard Voice Connections', value: this.client.voiceConnections.size },
        { inline: true, name: ':clock: Shard Uptime', value: pms(this.client.uptime, { verbose: true, secDecimalDigits: 0 }) }
      ]
    ));
  }
}

module.exports = ShardInfo;