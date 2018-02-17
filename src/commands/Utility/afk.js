const Command = require('../../structures/Command.js');
const { mdb } = require('../../util/Config.js');


class Afk extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'afk',
      desc: 'Marks the user as away.'
    });
  }
  async execute(m) {
    this.start(m.channel);
    if (!this.client.dbm.db) {
      this.end(m.channel);
      return m.errors.databaseUnavailable();
    }
    const afkCollection = this.client.dbm.collection(mdb.afk);
    if (m.mentions.users.size > 0 || m.mentions.roles.size > 0 || m.mentions.everyone) {
      this.end(m.channel);
      return m.channel.send(':no_entry: You can\'t tag anyone with this command!');
    }
    const reason = this.client.getAllArguments([m.args[0]], m.content);
    if (reason.length > 500) {
      this.end(m.channel);
      return m.channel.send(':no_entry: Your reason cannot be more than 500 characters!');
    }
    await afkCollection.insertOne({ name: m.author.username, id: m.author.id, reason });
    this.end(m.channel);
    return m.channel.send(`:wave: Alright, I've now set you as AFK: ${reason}`);
  }
}

module.exports = Afk;