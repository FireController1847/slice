/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

/**
 * This file is used as an example on how to set up the tokens.
 * Create a file in this folder called 'Tokens.js' and fill each field
 * with their respective values.
 */

/**
 * The main bot token
 * @type {string}
 */
exports.token = '';

/**
 * MongoDB Login Information
 * @type {object}
 */
exports.mongo = {
  username: '',
  password: '',
  host: '',
  port: '',
  database: '',
  collections: {
    guilds: 'guilds',
    donations: 'donations'
  }
};