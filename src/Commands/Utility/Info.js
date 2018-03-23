const ce = require('embed-creator');
const { version, Command } = require('discord-akairo');
const discord = require('discord.js');
const moment = require('moment-timezone');

function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
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

class UserInformation {
  constructor(member) {
    this.username = member.user.username;
    this.nickname = member.nickname || 'None';
    this.id = member.id;
    this.discrim = member.user.discriminator;
    this.bot = member.user.bot ? 'bot' : 'member';
    this.created = moment(member.user.createdAt).tz('America/Denver').format('dddd, MMMM Do, YYYY [at] h:mm A zz');
    this.joined = moment(member.joinedAt).tz('America/Denver').format('dddd, MMMM Do, YYYY [at] h:mm A zz');
    this.status = member.user.presence.status ? capFirstLetter(member.user.presence.status) : 'Offline';
    this.activity = member.user.presence.activity ? capFirstLetter(member.user.presence.activity.name) : 'None';
    this.avatar = member.user.displayAvatarURL({ size: 2048 });
    this.vc = member.voiceChannel ? member.voiceChannel.name : 'None';
    this.roles = member.roles.size;
    this.highest = member.roles.highest.name.includes('@everyone') ? 'Everyone' : member.roles.highest.name;
  }
}
class GuildInformation {
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

class Ping extends Command {
  constructor() {
    super('info', {
      aliases: ['info'],
      description: 'The base command for getting information.',
      args: [
        {
          id: 'infoType',
          type: 'lowercase'
        }
      ]
    });
  }
  exec(m, args) {
    if (!args.infoType) {
      return m.channel.send('Invalid Option. Please choose `bot`, `user`, `shard`, or `guild` (`server`). ' +
        `Example: \`${this.client.akairoOptions.prefix}${this.id} bot\``);
    } else if (args.infoType == 'user') {
      return this.user(m, args);
    } else if (args.infoType == 'shard') {
      return this.shard(m, args);
    } else if (args.infoType == 'bot') {
      return this.bot(m, args);
    } else if (['guild', 'server'].includes(args.infoType)) {
      return this.guild(m, args);
    }
  }
  user(m) {
    const member = m.mentions.members.first() || m.member;
    const info = new UserInformation(member);
    const fields = [
      { inline: true, name: ':1234: Identifier', value: info.id.toString() },
      { inline: true, name: ':hash: Discriminator', value: info.discrim.toString() },
      { inline: true, name: ':hammer: Amount of Roles', value: info.roles.toString() },
      { inline: true, name: ':speaker: Voice Channel', value: info.vc.toString() },
      { inline: true, name: ':red_circle: Presence', value: info.status.toString() },
      { inline: true, name: ':keyboard: Nickname', value: info.nickname.toString() },
      { inline: true, name: ':video_game: Activity', value: info.activity.toString() },
      { inline: true, name: ':top: Highest Role', value: info.highest.toString() },
      { name: ':tools: Creation Date', value: info.created.toString() },
      { name: ':white_check_mark: Join Date', value: info.joined.toString() }
    ];
    if (info.avatar.includes('.gif')) {
      fields.push({
        name: ':warning: Gif Avatar',
        value: `[To keep loading time short, I only show your avatar preview. Click here to view your full GIF avatar.](${member.user.displayAvatarURL({ size: 2048 })})`
      });
      info.avatar = member.user.displayAvatarURL({ format: 'webp', size: 2048 });
    }
    return m.channel.send(ce(
      '#FE8B00', null, 'User Information',
      `Here's some information about the ${info.bot} ${info.username}`,
      fields, null, { thumbnail: info.avatar }, true
    ));
  }
  shard(m) {
    return m.channel.send('This version of Slice is currently not sharded, so this option is unavailable.');
    // eslint-disable-next-line no-unreachable
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
  async bot(m) {
    let app;
    try {
      app = await this.client.fetchApplication();
    } catch (e) {
      return m.channel.send(`There was an internal error.\n\`\`\`js\n${e}\n\`\`\``);
    }
    return m.channel.send(ce(
      '#FE8B00', null, 'Bot Information',
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
  async guild(m) {
    try {
      await m.guild.members.fetch();
    } catch (e) {
      return m.channel.send(`There was an internal error.\n\`\`\`js\n${e}\n\`\`\``);
    }
    const info = new GuildInformation(m.guild);
    return m.channel.send(ce(
      '#FE8B00', null, 'Guild Information',
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

module.exports = Ping;