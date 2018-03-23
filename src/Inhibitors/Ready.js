const { Listener } = require('discord-akairo');

class Ready extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    });
  }

  exec() {
    this.client.user.setActivity(`${this.client.akairoOptions.prefix}help`, {
      url: 'https://www.twitch.tv/monstercat/',
      type: 'STREAMING'
    });
    console.log(`Online and ready! This shard is on ${this.client.guilds.size} guilds.`);
  }
}

module.exports = Ready;