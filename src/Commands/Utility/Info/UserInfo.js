/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const ce = require('embed-creator');
const { Command } = require('discord-akairo');
const moment = require('moment-timezone');

function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
class Information {
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
    if (!this.activity.replace(/\s/g, '')) this.activity = 'None';
    this.avatar = member.user.displayAvatarURL({ size: 2048 });
    this.vc = member.voiceChannel ? member.voiceChannel.name : 'None';
    this.roles = member.roles.size;
    this.highest = member.roles.highest.name.includes('@everyone') ? 'Everyone' : member.roles.highest.name;
  }
}
class UserInfo extends Command {
  constructor() {
    super('userinfo', {
      description: 'Gives information about a user!',
      channel: 'guild',
      typing: true
    });
  }
  exec(m) {
    const member = m.mentions.members.first() || m.member;
    const info = new Information(member);
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
      this.client.akairoOptions.colors.orange, null, 'User Information',
      `Here's some information about the ${info.bot} ${info.username}`,
      fields, null, { thumbnail: info.avatar }, true
    ));
  }
}

module.exports = UserInfo;