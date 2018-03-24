const { Listener } = require('discord-akairo');

class CommandHandlerCommandFinished extends Listener {
  constructor() {
    super('commandHandlerCommandFinished', {
      emitter: 'commandHandler',
      event: 'commandFinished'
    });
  }

  exec(m, c) {
    if (m.guild) console.log(`User ${m.author.username} (${m.author.id}) issued server command ${this.client.akairoOptions.prefix}${c.id} in ${m.guild.name} (${m.guild.id}), #${m.channel.name}`);
    else console.log(`User ${m.author.username} (${m.author.id}) issued private command ${this.client.akairoOptions.prefix}${c.id}.`);
  }
}

module.exports = CommandHandlerCommandFinished;