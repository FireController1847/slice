const Event = require('../structures/Event.js');
const { mdb, messages, owners } = require('../util/Config.js');

class Message extends Event {
  constructor(client, path) {
    super(client, path, { event: 'message' });
  }
  async execute(m) {
    if (m.author.bot || (m.guild && !m.guild.available)) return;
    m.isDM = m.guild ? false : true;
    if (!m.isDM) {
      try {
        m.guildData = await this.client.dbm.fetchGuildData(m.guild.id);
      } catch (e) {
        m.guildData = null;
      }
    }
    m.prefix = !m.server || m.server.settings.prefix == 'default' ?
      messages.prefix : m.server.settings.prefix;
    const mreg = new RegExp(`^<@!?${this.client.user.id}>`);
    if (mreg.test(m.content)) {
      m.content = m.prefix + m.content.replace(mreg, '').replace(' ', '');
      m.mentions.users = m.mentions.users.filter(u => u.id != this.client.user.id);
      if (m.content.toLowerCase().includes('what') && m.content.toLowerCase().includes('prefix')) {
        m.content = `${m.prefix}prefix`;
      }
    }
    // AFK
    try {
      const afkCollection = this.client.dbm.collection(mdb.afk);
      const afkData = await afkCollection.findOne({ id: m.author.id });
      if (afkData && afkData.id == m.author.id) {
        await m.channel.send(':sparkles: Welcome back! I\'ve removed your AFK message.');
        await afkCollection.deleteMany({ id: m.author.id });
      }
    } catch (e) {
      // ...
    }
    // AFK Tag
    if (m.mentions.users.size > 0) {
      try {
        const afkCollection = await this.client.dbm.collection(mdb.afk);
        const afkData = await afkCollection.findOne({ id: m.mentions.users.first().id });
        if (afkData && afkData.id != m.author.id) {
          await m.channel.send(`:diamond_shape_with_a_dot_inside: ${afkData.name} is currently AFK: ${afkData.reason}`);
        }
      } catch (e) {
        // ...
      }
    }
    if (!m.content.startsWith(m.prefix)) return;
    m.isOwner = owners.includes(m.author.id);
    m.args = m.content.split(' ');
    m.argsLower = m.content.toLowerCase().split(' ');
    m.command = m.argsLower[0].substring(m.prefix.length, m.argsLower[0].length);
    /* eslint-disable max-len */
    m.errors = {
      noDMSupport: function noDMSupport() { return m.channel.send(':warning: This command does not support Direct Messages.'); },
      notBotOwner: function notBotOwner() { return m.channel.send(':no_entry_sign: You\'re not a bot owner. You do not have permission to use this command.'); },
      cantEmbedLinks: function cantEmbedLinks() { return m.channel.send(':link: This command won\'t run because the following permissions are missing: `Embed Links`'); },
      databaseUnavailable: function databaseUnavailable() { return m.channel.send(':satellite: This command has failed to run as the database is currently unavailable. Please have some patience and allow the database to reconnect.'); },
      userBlacklisted: function userBlacklisted() { return m.channel.send(':page_facing_up: You have been blacklisted from this bot. You do not have permission to use commands.'); },
      internalError: function internalError(e, msg) { return m.channel.send(`:boom: There was an internal error. ${msg ? msg : 'Please '}report this to a bot developer.\`\`\`js\n${e.stack}\n\`\`\``); }
    };
    /* eslint-enable max-len */
    m.ep = true;
    if (!m.isDM) {
      try {
        if (!m.channel.permissionsFor(m.guild.me).has('SEND_MESSAGES')) {
          return m.author.send(`The bot does not have permission to send messages in <#${m.channel.id}>.`);
        }
      } catch (e) {
        return;
      }
      try {
        m.ep = m.channel.permissionsFor(m.guild.me).has('EMBED_LINKS');
      } catch (e) {
        m.ep = false;
      }
    }
    try {
      const blacklist = await this.dbm.collection(mdb.blacklist);
      if (!blacklist) throw new Error();
      if (await blacklist.findOne({ id: m.author.id })) return m.errors.userBlacklisted();
      if (!m.isDM && await blacklist.findOne({ id: m.guild.id })) {
        m.guild.owner.send(`:crossed_swords: Your guild ${m.guild.name} has been blacklisted from this bot.`);
        m.guild.leave();
      }
    } catch (e) {
      // ...
    }
    const command = this.client.getCommand(m.command);
    if (!command) return;
    if (!m.isDM) {
      this.client.debug(`User ${m.author.username} (${m.author.id}) issued server command ` +
        `${m.prefix}${m.command} in ${m.guild.name} (${m.guild.id}), #${m.channel.name}.`);
    } else {
      this.client.debug(`User ${m.author.username} (${m.author.id}) issued private command ` +
        `${m.prefix}${m.command} in DM's.`);
    }
    try {
      await Promise.resolve(command.execute(m));
    } catch (e) {
      command.end(m.channel);
      return m.errors.internalError(e);
    }
  }
}

module.exports = Message;
