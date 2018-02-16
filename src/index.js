const { ShardingManager } = require('discord.js');
const { token } = require('./util/Tokens.js');
const sm = new ShardingManager('./client/Slice.js', { token });
sm.spawn();