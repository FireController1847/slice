const { Command } = require('discord-akairo');

class Give extends Command {
  constructor() {
    super('give', {
      aliases: ['give'],
      description: 'Gives a user a role.',
      typing: true,
      userPermissions: ['MANAGE_ROLES'],
      clientPermissions: ['MANAGE_ROLES'],
      args: [
        {
          id: 'member',
          type: 'member'
        },
        {
          id: 'role',
          type: 'role'
        }
      ]
    });
  }
  async exec(m, args) {
    if (!m.guild.me) return;
    if (!args.member) return m.channel.send('You must tag a member to give this role too.');
    if (!args.role) return m.channel.send('You must include a role name or ID after tagging the member.');
    if (m.guild.me.roles.highest.position < args.role.position) return m.channel.send('I can\'t give the user a role that is above my highest role. Please give me a higher role to do this.');
    if (m.member.roles.highest.position < args.role.position) return m.channel.send('I won\'t give users roles that are above your highest role.');
    if (args.member.roles.has(args.role.id)) return m.channel.send(`That member already has the ${args.role.name} role!`);
    await args.member.roles.add(args.role);
    return m.channel.send(`Alright, I've given <@${args.member.id}> the role ${args.role.name}.`);
  }
}

module.exports = Give;