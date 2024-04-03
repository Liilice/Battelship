/*jslint browser this */
/*global _, player */

(function (global) {
  "use strict";

  var computer = _.assign({}, player, {
    grid: [],
    tries: [],
    fleet: [],
    game: null,
    play: function () {
      var self = this;
      setTimeout(function () {
        self.game.fire(this, 0, 0, function (hasSucced) {
          self.tries[0][0] = hasSucced;
        });
      }, 2000);
    },
    isShipOk: function (callback) {
      var self = this;

      // var i = 0;
      // var j;
      this.fleet.forEach(function (ship, i) {
        var i = Math.floor(Math.random() * 10);
        var x = Math.floor(Math.random() * (10 - ship.life + 1));
        var j = 0;
        while (j < ship.life) {
          if (self.grid[i][x + j] !== 0) {
            return;
          } else {
            self.grid[i][x + j] = ship.getId();
          }
          j += 1;
        }
      }, this);

      setTimeout(function () {
        callback();
      }, 500);
    },
  });

  global.computer = computer;
})(this);
