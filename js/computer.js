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
      console.log(this.tries);
      setTimeout(function () {
        var line;
        var col;
        self.game.fire(this, 0, 0, function (hasSucced) {
          line = Math.floor(Math.random() * 10);
          col = Math.floor(Math.random() * 10);
          self.tries[line][col] = hasSucced;
        });
      }, 2000);
    },
    isShipOk: function (callback) {
      var self = this;
      // var i = 0;
      var j;
      var array = [];
      var ramdom;
      for (let i = 0; i < 4; i++) {
        ramdom = Math.floor(Math.random() * 10);
        if (array.includes(ramdom)) {
          console.log("double", ramdom);
          ramdom = Math.floor(Math.random() * 10);
        }
        array.push(ramdom);
      }
      // console.log(array);
      this.fleet.forEach(function (ship, i) {
        var x = Math.floor(Math.random() * (10 - ship.life + 1));
        j = 0;
        while (j < ship.life) {
          if (ship.id === 5) {
            this.grid[array[0]][x + j] = ship.getId();
          } else if (ship.id === 6) {
            this.grid[array[1]][x + j] = ship.getId();
          } else if (ship.id === 7) {
            this.grid[array[2]][x + j] = ship.getId();
          } else {
            this.grid[array[3]][x + j] = ship.getId();
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
