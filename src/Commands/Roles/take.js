/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { Command } = require('discord-akairo');

class Give extends Command {
  constructor() {
    super('take', {
      aliases: ['take'],
      description: 'Takes a user\'s role.',
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
    if (!args.member) return m.channel.send('You must tag a member to take this role from.');
    if (!args.role) return m.channel.send('You must include a role name or ID after tagging the member.');
    if (m.guild.me.roles.highest.position < args.role.position) return m.channel.send('I can\'t take a role from the user that is above my highest role. Please give me a higher role to do this.');
    if (m.member.roles.highest.position < args.role.position) return m.channel.send('I won\'t take a user\'s roles that are above your highest role.');
    if (!args.member.roles.has(args.role.id)) return m.channel.send(`That member doesn't have ${args.role.name} as a valid role.`);
    await args.member.roles.remove(args.role);
    return m.channel.send(`Alright, I've taken ${args.member.displayName}'s ${args.role.name} role.`);
  }
}

module.exports = Give;