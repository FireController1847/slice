const { Listener } = require('discord-akairo');

class ClientGuildCreate extends Listener {
  constructor() {
    super('clientGuildCreate', {
      emitter: 'client',
      event: 'guildCreate'
    });
  }

  exec(guild) {
    this.client.mongo.createGuild(guild.id);
  }
}

module.exports = ClientGuildCreate;