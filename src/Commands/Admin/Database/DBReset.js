const { Command } = require('discord-akairo');

class DBDebug extends Command {
  constructor() {
    super('dbreset', {
      description: 'Resets the guild\'s settings.'
    });
  }
  async exec(m) {
    await this.client.mongo.guilds.deleteMany({ gid: m.guild.id });
    await this.client.mongo.createGuild(m.guild.id);
    return m.channel.send('Your guild\'s settings has successfully been reset.');
  }
}

module.exports = DBDebug;