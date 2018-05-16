/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { Command } = require('discord-akairo');
const moment = require('moment-timezone');

class Time extends Command {
  constructor() {
    super('time', {
      aliases: ['time'],
      description: 'Gets the time of the specified location.',
      typing: true,
      args: [
        {
          id: 'location',
          type: 'content'
        }
      ]
    });
  }
  exec(m, args) {
    args.location = args.location.replace(/ /g, '_');
    let zone = moment.tz.zone(args.location);
    if (!zone) zone = moment.tz.zone(`America/${args.location}`);
    if (!zone) return m.channel.send(':warning: You must include a valid timezone location. To find a list of timezones, go here. http://cdn.visualfiredev.com/bots/timezone_names.txt');
    const time = moment(new Date()).tz(zone.name);
    return m.channel.send(`The current date in that area is ${time.format('dddd, MMMM Do, YYYY [at] h:mm A zz')}.`);
  }
}

module.exports = Time;