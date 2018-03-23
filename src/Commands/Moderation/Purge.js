const { Command } = require('discord-akairo');

class Purge extends Command {
  constructor() {
    super('purge', {
      aliases: ['purge'],
      description: 'Purges a specific amount of messages.',
      typing: true,
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          id: 'amount',
          type: 'number',
          default: 0
        }
      ]
    });
  }
  async exec(m, args) {
    if (!args.amount) return m.channel.send(`You must include an amount of messages between 2 and 100.`);
    else if (args.amount <= 1) return m.channel.send(`You cannot delete one or less messages.`);
    else if (args.amount > 100) return m.channel.send(`Discord limits me to deleting 100 messages at a time, sorry!`);
    const deleted = await m.channel.bulkDelete(args.amount != 100 ? args.amount + 1 : args.amount, true);
    if (deleted.size < args.amount) {
      return m.channel.send(`:warning: I was unable to delete the requested amount, ` +
        `so I've deleted ${deleted.size >= 100 ? deleted.size : deleted.size - 1} message(s). Please note I cannot delete messages older than two weeks.`);
    }
    m.channel.send(`:white_check_mark: Alright, I've deleted ${deleted.size >= 100 ? deleted.size : deleted.size - 1} message(s).`);
  }
}

module.exports = Purge;