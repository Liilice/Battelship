/*jslint browser this */
/*global _, player */

(function (global) {
  "use strict";

  var computer = _.assign({}, player, {
    grid: [],
    tries: [],
    fleet: [],
    game: null,
    setGame: function (game) {
      this.game = game;
    },
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
        var row = Math.floor(Math.random() * 10);
        var col = Math.floor(Math.random() * (11 - ship.life));
        // var col = 0;
        var j = 0;
        // console.log("i = ", i);
        // console.log("x = ", x);

        while (j < ship.life) {
          if (self.grid[i][x + j] !== 0) {
            // var col = 0;
            self.grid[row][col + j] = ship.getId();
            // console.log("dedefs");
            // return;
          } else {
            self.grid[i][x + j] = ship.getId();
          }
          j += 1;
        }
        // console.log(self.grid);
      }, this);

      setTimeout(function () {
        callback();
      }, 500);
    },
  });

  global.computer = computer;
})(this);
