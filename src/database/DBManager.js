const { MongoClient } = require('mongodb');
const { mongo } = require('../util/Tokens.js');

class DefaultServer {
  constructor(gid) {
    this.gid = gid;
    this.music = {
      // Prefer FM Radio, but can be overridden
      disabled: true,
      volume: 80 / 400,
      queue: []
    };
    this.settings = {
      notifications: true,
      preferEmbeds: true,
      noInvite: '',
      noLink: '',
      prefix: 'default',
      joinMessage: {
        enabled: false,
        channel: '',
        message: ''
      },
      leaveMessage: {
        enabled: false,
        channel: '',
        message: ''
      },
      joinBotRole: {
        enabled: false,
        channel: '',
        rid: ''
      },
      joinRole: {
        enabled: false,
        channel: '',
        rid: ''
      }
    };
  }
}

class DBManager {
  constructor(client) {
    this.client = client;
    this.url = `mongodb://${
      mongo.username}:${
      mongo.password}@${
      mongo.host}:${
      mongo.port}/${
      mongo.database}`;
    this.mclient = null;
    this.db = null;
  }
  // Debug
  debug(...args) {
    return this.client.debug(`[DB]`, ...args);
  }
  error(...args) {
    return this.client.error(`[DB]`, ...args);
  }
  // Connect
  async connect() {
    this.debug('Creating Database...');
    this.mclient = await MongoClient.connect(this.url, null);
    this.db = this.mclient.db(mongo.database);

    this.db.on('close', mongoError => {
      this.error('Database Randomly Closed');
      if (mongoError) this.error(`Error: ${mongoError.stack}`);
    });
    this.db.on('error', mongoError => {
      this.error('Database Internal Error');
      if (mongoError) this.error(`Error: ${mongoError.stack}`);
    });
    this.db.on('reconnect', mongoError => {
      this.debug('Database Reconnected');
      if (mongoError) this.error(`Error: ${mongoError.stack}`);
    });
    this.db.on('timeout', mongoError => {
      this.error('Database Timeout');
      if (mongoError) this.error(`Error: ${mongoError.stack}`);
    });

    this.debug('Database Created.');
    return this.db;
  }
  // Utilities
  async makeNewGuild(gid, isMissing = false) {
    if (!this.db) throw new Error('Database Not Ready');
    const guild = this.client.guilds.get(gid);
    if (!guild) throw new Error('Client Cannot Find Guild');
    const gCollection = this.db.collection(this.client.config.mongodb.collections.guildData);
    if (!gCollection) throw new Error('Guild Database Missing');
    await gCollection.deleteMany({ gid });
    const gData = new DefaultServer(gid);
    await gCollection.insertOne(gData);
    console.log(!guild ? `I've joined ${gid}.` : `I've ${(isMissing ? 'added missing guild' : 'joined')} ` +
      `${guild.name} (${guild.id}) owned by ${guild.owner.user.username} (${guild.owner.id}).`);
    return gData;
  }
  async fetchGuildData(gid) {
    if (!this.db) throw new Error('Database Not Ready');
    const gCollection = await this.getCollection(this.client.config.mongodb.collections.guildData);
    const dCollection = await this.getCollection(this.client.config.mongodb.collections.donationData);
    if (!gCollection || !dCollection) throw new Error('Guild or Donations Collection Missing');
    let gData = await gCollection.findOne({ gid: gid });
    if (!this.client.config.IsBeta && !gData) gData = await this.makeNewGuild(gid, true);
    if (!gData) return null;
    delete gData._id;
    const da = await dCollection.findOne({ guild_id: gid });
    if (!da) { gData.donationAmount = 0; } else {
      delete da._id;
      gData.donationAmount = da.amount;
    }
    return gData;
  }
}

module.exports.DBManager = DBManager;