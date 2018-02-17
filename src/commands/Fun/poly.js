const Command = require('../../structures/Command.js');
const trianglify = require('trianglify');

class Poly extends Command {
  constructor(client, path) {
    super(client, path, {
      name: 'poly',
      desc: 'Generates a polygonal image'
    });
  }
  async execute(m) {
    // Parse Arguments
    let theargs = this.client.getAllArguments([m.args[0]], m.cleanContent).split('--');
    const acceptable = ['width', 'height', 'cell_size', 'x_colors', 'y_colors', 'variance'];
    theargs.shift();
    theargs = theargs.map((arg, key) => {
      if (key == theargs.length - 1) return arg.split(/ (.+)/);
      else return arg.substring(arg, arg.length - 1).split(/ (.+)/);
    });
    for (let i = 0; i < theargs.length; i++) {
      theargs[i].pop();
      if (acceptable.includes(theargs[i][0])) {
        try {
          theargs[i][1] = JSON.parse(theargs[i][1]);
        } catch (e) {
          return m.errors.internalError(e, 'Your arguments are invalid. Please ');
        }
        if (theargs[i][0] == 'x_colors' || theargs[i][0] == 'y_colors') {
          if (!Array.isArray(theargs[i][1]) &&
            theargs[i][1] != 'random' &&
            theargs[i][1] != null) {
            return m.channel.send(`You must include valid color arguments!`);
          }
          if (theargs[i][1] != null &&
            theargs[i][1].length <= 1) {
            return m.channel.send(`You must include more than one color!`);
          }
        } else {
          if (typeof theargs[i][1] != 'number') return m.channel.send(`You must include valid number arguments!`);
          if (theargs[i][0] == 'width' && (theargs[i][1] > 3840 || theargs[i][1] < 10)) {
            return m.channel.send(`Your width cannot be more than 3840 or less than 8!`);
          }
          if (theargs[i][0] == 'height' && (theargs[i][1] > 2160 || theargs[i][1] < 10)) {
            return m.channel.send(`Your width cannot be more than 2160 or less than 8!`);
          }
          if (theargs[i][0] == 'variance' && (theargs[i][1] > 1 || theargs[i][1] < 0)) {
            return m.channel.send(`Your variance must be between 0 and 1!`);
          }
          if (theargs[i][0] == 'cell_size' && (theargs[i][1] < 50)) {
            return m.channel.send(`Your cell size MUST be above 50 to prevent long times of the bot crashing.`);
          }
        }
      }
    }
    theargs = theargs.filter(arg => acceptable.includes(arg[0]));
    /* eslint-disable max-len */
    const width = typeof theargs.find(a => a[0] == 'width') !== 'undefined' ? theargs.find(a => a[0] == 'width')[1] : 1920;
    const height = typeof theargs.find(a => a[0] == 'height') !== 'undefined' ? theargs.find(a => a[0] == 'height')[1] : 1080;
    const cell_size = typeof theargs.find(a => a[0] == 'cell_size') !== 'undefined' ? theargs.find(a => a[0] == 'cell_size')[1] : 150;
    const x_colors = typeof theargs.find(a => a[0] == 'x_colors') !== 'undefined' ? theargs.find(a => a[0] == 'x_colors')[1] : 'random';
    const y_colors = typeof theargs.find(a => a[0] == 'y_colors') !== 'undefined' ? theargs.find(a => a[0] == 'y_colors')[1] : 'random';
    const variance = typeof theargs.find(a => a[0] == 'variance') !== 'undefined' ? theargs.find(a => a[0] == 'variance')[1] : 1;
    /* eslint-enable max-len */
    const options = { width, height, cell_size, x_colors, y_colors, variance };
    let includeme = m.author.toString();
    if (theargs.length <= 0) {
      includeme += ', Want to spruce up this random polygon and customize it to your liking? Check out the options ' +
        'linked here! https://www.npmjs.com/package/trianglify#options. For an example, run `s!polye`!';
    }
    this.start(m.channel);
    const pngURI = trianglify(options).png();
    const data = pngURI.substring(pngURI.indexOf('base64') + 7);
    const buffer = new Buffer(data, 'base64');
    await m.channel.send(includeme, { files: [buffer] });
    this.end(m.channel);
  }
}

module.exports = Poly;