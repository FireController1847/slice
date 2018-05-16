/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { Listener } = require('discord-akairo');

class ProcessUnhandledRejection extends Listener {
  constructor() {
    super('processUnhandledRejection', {
      emitter: 'process',
      event: 'unhandledRejection'
    });
  }

  exec(e) {
    return console.error(e);
  }
}

module.exports = ProcessUnhandledRejection;