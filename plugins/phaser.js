export default ({ app }, inject) => {
    if (process.client) {
      const Phaser = require('phaser');
      inject('Phaser', Phaser);
    }
  };