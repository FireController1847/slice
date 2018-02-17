/* eslint-disable max-len */
const ce = require('embed-creator');
const { colors } = require('../../../util/Config.js');
const Command = require('../../../structures/Command.js');
const moment = require('moment-timezone');

const names = {
  'brazil': 'Brazil',
  'eu-central': 'Central Europe',
  'hongkong': 'Hong Kong',
  'japan': 'Japan',
  'russia': 'Russia',
  'singapore': 'Singapore',
  'sydney': 'Sidney',
  'us-central': 'US Central',
  'us-east': 'US East',
  'us-south': 'US South',
  'us-west': 'US West',
  'eu-west': 'Western Europe'
};
const levels = {
  0: 'None',
  1: 'Low',
  2: 'Medium',
  3: '(╯°□°）╯︵ ┻━┻',
  4: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

class Information {
  constructor(guild) {
    this.name = guild.name;
    this.owner = `${guild.owner.user.tag} (${guild.owner.id})`;
    this.region = names[guild.region] || guild.region;
    this.level = levels[guild.verificationLevel];
    this.icon = guild.iconURL({ format: 'webp', size: 2048 });
    this.created = moment(guild.createdAt).tz('America/Denver').format('dddd, MMMM Do, YYYY [at] h:mm A zz');
    this.emojis = guild.emojis.size;
    this.members = `Total >> ${guild.memberCount}\n` +
      `Users >> ${guild.members.filter(mem => !mem.user.bot).size}\n` +
      `Bots >> ${guild.members.filter(mem => mem.user.bot).size}`;
    this.channels = `Total >> ${guild.channels.size}\n` +
      `Categories >> ${guild.channels.filter(ch => ch.type == 'category').size}\n` +
      `Text >> ${guild.channels.filter(ch => ch.type == 'text').size}\n` +
      `Voice >> ${guild.channels.filter(ch => ch.type == 'voice').size}`;
    this.roles = `Total >> ${guild.roles.size}\n` +
      `Hidden >> ${guild.roles.filter(role => !role.hoised).size}\n` +
      `Hoised >> ${guild.roles.filter(role => role.hoised).size}\n`;
  }
}

class ShardInfo extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'GUILD_INFO',
      desc: 'Gives information about what guild I\'m in!'
    });
  }
  async execute(m) {
    this.start(m.channel);
    if (m.isDM) {
      this.end(m.channel);
      return m.errors.noDMSupport();
    }
    if (!m.ep) {
      this.end(m.channel);
      return m.errors.cantEmbedLinks();
    }
    try {
      await m.guild.members.fetch();
    } catch (e) {
      this.end(m.channel);
      return m.errors.internalError(e);
    }
    const info = new Information(m.guild);
    this.end(m.channel);
    return m.channel.send(ce(
      colors.orange, null, 'Guild Information',
      'Here\'s some information about the part of me that\'s on your server!',
      [
        { name: ':pencil: Name', value: info.name.toString() },
        { name: ':speaker: Owner', value: info.owner.toString() },
        { name: ':globe_with_meridians: Region', value: info.region.toString() },
        { name: '<:vfdGreenTick:378652440758845442> Verification Level', value: info.level },
        { name: ':stuck_out_tongue_winking_eye: Emoji Count', value: info.emojis },
        { name: ':tools: Creation Date', value: info.created },
        { name: ':family: Members', value: info.members },
        { name: ':hash: Channels', value: info.channels },
        { name: ':basketball_player: Roles', value: info.roles }
      ], null, { thumbnail: info.icon }
    ));
  }
}

module.exports = ShardInfo;