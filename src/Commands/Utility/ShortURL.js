/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const request = require('snekfetch');

class ShortURL extends Command {
  constructor() {
    super('shorturl', {
      aliases: ['shorturl'],
      description: 'Converts the given URL into a shortened version using tinyurl.com',
      typing: true
    });
  }
  async exec(m) {
    const url = m.content.slice(m.content.search(' ') + 1);

    const res = await request.get(`http://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);

    const embed = new MessageEmbed()
      .setTitle('URL Shortener')
      .setDescription('Shortens any URL that is specified.')
      .setColor(0xA52A2A)
      .setTimestamp()
      .addField('Original URL', url, false)
      .addField('Shortened URL', res.body, false);

    m.channel.send({ embed });
  }
}

module.exports = ShortURL;