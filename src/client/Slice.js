const { Client, Collection } = require('discord.js');
const { DBManager } = require('../database/DBManager.js');
const { files } = require('../util/Config.js');
const fs = require('fs');
const klaw = require('klaw');
const moment = require('moment-timezone');
const path = require('path');
const { token } = require('../util/Tokens.js');

class Slice extends Client {
  constructor() {
    super({ disableEveryone: true });

    this.config = require('../util/Config.js');
    this.commands = new Collection();
    this.events = new Collection();
    this.dbm = new DBManager(this);

    this.addcommands();
    this.addevents();

    this.dbm.connect();
    this.debug(`Logging in...`);
    this.login(token);
  }
  debug(...args) {
    const date = moment();
    console.log(`[${date.format('HH:MM:SS')}]`, `[Shard ${this.shard.id}]`, ...args);
    this.log(`[${date.format('HH:MM:SS')}] [Shard ${this.shard.id}] ${args.join(' ')}`).catch(() => {
      // ...
    });
  }
  error(...args) {
    const date = moment();
    console.error(`[${date.format('HH:MM:SS')}]`, `[Shard ${this.shard.id}]`, ...args);
    this.log(`[${date.format('HH:MM:SS')}] [Shard ${this.shard.id}] ${args.join(' ')}`).catch(() => {
      // ...
    });
  }
  log(string) {
    return new Promise((resolve, reject) => {
      fs.open(`${files.logs}/Log_${moment().format('MM-DD-YYYY')}.log`, 'a', (err1, fd) => {
        if (err1) return reject(err1);
        fs.write(fd, `${string}\n`, err2 => {
          if (err2) return reject(err2);
          fs.close(fd, err3 => {
            if (err3) return reject(err3);
            return resolve();
          });
        });
      });
    });
  }
  addcommands(reload = false) {
    klaw(files.commands).on('data', file => {
      file = path.parse(file.path);
      if (!file.ext || file.ext != '.js') return;
      file.special = `${file.dir}/${file.base}`;
      if (reload && require.cache[require.resolve(file.special)]) {
        delete require.cache[require.resolve(file.special)];
      }
      const command = new (require(file.special))(this);
      this.commands.set(command.name, command);
    });
  }
  addevents(reload = false) {
    if (reload) this.events.forEach(event => this.removeAllListeners(event.event));
    klaw(files.events).on('data', file => {
      file = path.parse(file.path);
      if (!file.ext || file.ext != '.js') return;
      file.special = `${file.dir}/${file.base}`;
      if (reload && require.cache[require.resolve(file.special)]) {
        delete require.cache[require.resolve(file.special)];
      }
      const event = new (require(file.special))(this, file.special);
      this.events.set(event.event, event);
      this.on(event.event, (...args) => {
        event.execute(...args);
      });
    });
  }
  async getAllShardsAvailable() {
    try {
      await this.shard.fetchClientValues('ping');
    } catch (e) {
      return false;
    }
    return true;
  }
  async getAndReduce(clientValue) {
    const vCount = await this.shard.fetchClientValues(clientValue);
    return vCount.reduce((a, b) => a + b, 0);
  }
  getCommand(name) {
    if (this.commands.has(name)) return this.commands.get(name);
    this.commands.forEach(c => { if (c.aliases && c.aliases.includes(name)) return c; });
    return null;
  }
  getAllArguments(args, text) {
    return text.substring(args.map(a => a.length + 1).reduce((a, b) => a + b, 0), text.length);
  }
}

exports = new Slice();

process.on('unhandledRejection', console.log);