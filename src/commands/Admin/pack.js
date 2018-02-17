const Command = require('../../structures/Command.js');
const { files } = require('../../util/Config.js');
const fs = require('fs');
const JSZip = require('jszip');
const moment = require('moment');

class Pack extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'pack',
      desc: 'Packs all the logs into their appropriate ZIP files.'
    });
  }
  execute(m) {
    if (!m.isOwner) return m.errors.notBotOwner();
    let items;
    try {
      items = fs.readdirSync(files.logs);
    } catch (e) {
      return m.errors.internalError(e);
    }
    const months = {};
    items.forEach(f => {
      if (!f.startsWith('Log_') || !f.endsWith('.log')) return;
      let date = f.replace('Log_', '').replace('.log', '');
      date = new Date(date);
      if (months[date.getMonth()]) months[date.getMonth()].push({ filename: f, date: date });
      else months[date.getMonth()] = [{ filename: f, date: date }];
    });
    delete months[(new Date()).getMonth()];
    const fileszipped = [];
    try {
      Object.keys(months).forEach(key => {
        const zipped = new JSZip();
        months[key].forEach(item => {
          fileszipped.push(`${files.logs}/${item.filename}`);
          zipped.file(item.filename, fs.readFileSync(`${files.logs}/${item.filename}`));
        });
        const date = new Date(months[key][0].date);
        zipped.generateAsync({ type: 'nodebuffer' }).then(zip => {
          fs.writeFileSync(`${files.logs}/Logs_${moment(date).format('MM-YYYY')}.zip`, zip);
        });
      });
    } catch (e) {
      return m.errors.internalError(e);
    }
    try {
      // Unlink only after everything is successful, that way the log files
      // aren't lost.
      fileszipped.forEach(file => {
        fs.unlinkSync(file);
      });
    } catch (e) {
      // ...
    }
    return m.channel.send('All log files successfully zipped into their appropriate folders.');
  }
}

module.exports = Pack;