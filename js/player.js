/*jslint browser this */
/*global _, shipFactory, player, utils */

(function (global) {
  "use strict";

  var sheep = { dom: { parentNode: { removeChild: function () {} } } };

  var player = {
    grid: [],
    tries: [],
    fleet: [],
    game: null,
    activeShip: 0,
    setGame: function (game) {
      this.game = game;
    },
    // isShipOk: function () {},
    init: function () {
      // créé la flotte
      this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
      this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
      this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
      this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));

      // créé les grilles
      this.grid = utils.createGrid(10, 10);
      this.tries = utils.createGrid(10, 10);
    },
    play: function (col, line) {
      // appel la fonction fire du game, et lui passe une calback pour récupérer le résultat du tir
      this.game.fire(
        this,
        col,
        line,
        _.bind(function (hasSucced) {
          this.tries[line][col] = hasSucced;
        }, this)
      );
    },
    // quand il est attaqué le joueur doit dire si il a un bateaux ou non à l'emplacement choisi par l'adversaire
    receiveAttack: function (col, line, callback) {
      var succeed = false;

      if (this.grid[line][col] !== 0) {
        succeed = true;
        // this.grid[line][col] = 0;
      }
      callback.call(undefined, succeed);
    },
    setActiveShipPosition: function (x, y) {
      var ship = this.fleet[this.activeShip];
      var i = 0;

      var rotate = ship.dom.style.rotate;
      if (rotate === "90deg") {
        // Check vertical début
        if (ship.id === 2 || ship.id === 1) {
          if (y < 2 || y > 7) {
            return false;
          }
        }
        if (ship.id === 3) {
          if (y < 2 || y > 8) {
            return false;
          }
        }
        if (ship.id === 4) {
          if (y < 1 || y > 8) {
            return false;
          }
        }

        for (let i = 0; i < ship.getLife(); i++) {
          if (ship.id == 1 || ship.id == 2) {
            if (this.grid[y - 2][x] !== 0 || this.grid[y + 2][x] !== 0) {
              return false;
            }
          } else if (ship.id == 3) {
            if (this.grid[y - 2][x] !== 0 || this.grid[y + 1][x] !== 0) {
              return false;
            }
          } else {
            if (this.grid[y - 1][x] !== 0 || this.grid[y + 1][x] !== 0) {
              return false;
            }
          }
        }

        while (i < ship.getLife()) {
          if (ship.id === 4) {
            this.grid[y + i - 1][x] = ship.getId();
          } else {
            this.grid[y + i - 2][x] = ship.getId();
          }
          i += 1;
        }

        // Check vertical fin
      } else {
        // Check horizontal début
        if (ship.id === 2 || ship.id === 1) {
          if (x < 2 || x > 7) {
            return false;
          }
        }
        if (ship.id === 3) {
          if (x < 2 || x > 8) {
            return false;
          }
        }
        if (ship.id === 4) {
          if (x < 1 || x > 8) {
            return false;
          }
        }

        for (let i = 0; i < ship.getLife(); i++) {
          if (ship.id == 1 || ship.id == 2) {
            if (this.grid[y][x - 2] !== 0 || this.grid[y][x + 2] !== 0) {
              return false;
            }
          } else if (ship.id == 3) {
            if (this.grid[y][x - 2] !== 0 || this.grid[y][x + 1] !== 0) {
              return false;
            }
          } else {
            if (this.grid[y][x - 1] !== 0 || this.grid[y][x + 1] !== 0) {
              return false;
            }
          }
        }

        while (i < ship.getLife()) {
          if (ship.id === 4) {
            this.grid[y][x + i - 1] = ship.getId();
          } else {
            this.grid[y][x + i - 2] = ship.getId();
          }
          i += 1;
        }

        // Check horizontal fin
      }

      return true;
    },

    clearPreview: function () {
      this.fleet.forEach(function (ship) {
        if (ship.dom.parentNode) {
          ship.dom.parentNode.removeChild(ship.dom);
        }
      });
    },
    resetShipPlacement: function () {
      this.clearPreview();

      this.activeShip = 0;
      this.grid = utils.createGrid(10, 10);
    },
    activateNextShip: function () {
      if (this.activeShip < this.fleet.length - 1) {
        this.activeShip += 1;
        return true;
      } else {
        return false;
      }
    },
    renderTries: function (grid) {
      this.tries.forEach(function (row, rid) {
        row.forEach(function (val, col) {
          var node = grid.querySelector(
            ".row:nth-child(" +
              (rid + 1) +
              ") .cell:nth-child(" +
              (col + 1) +
              ")"
          );

          if (val === true) {
            node.style.backgroundColor = "#e60019";
          } else if (val === false) {
            node.style.backgroundColor = "#aeaeae";
          }
        });
      });
    },

    renderShips: function (grid) {
      this.tries.forEach(function (row, rid) {
        row.forEach(function (val, col) {
          var node = grid.querySelector(
            ".row:nth-child(" +
              (rid + 1) +
              ") .cell:nth-child(" +
              (col + 1) +
              ")"
          );
          if (val === true) {
            node.style.backgroundColor = "purple";
            var aligned = false;
            if (
              row[col] === true &&
              row[col + 1] === true &&
              row[col + 2] === true &&
              row[col + 3] === true &&
              row[col + 4]
            ) {
              if (
                node.getAttribute("name") === "battleship" ||
                node.getAttribute("name") === "destroyer"
              ) {
                aligned = true;
              }
            } else if (
              row[col] === true &&
              row[col + 1] === true &&
              row[col + 2] === true &&
              row[col + 3] === true
            ) {
              if (node.getAttribute("name") === "submarine") {
                aligned = true;
              }
            } else if (
              row[col] === true &&
              row[col + 1] === true &&
              row[col + 2] === true
            ) {
              if (node.getAttribute("name") === "small-ship") {
                aligned = true;
              }
            }
            if (aligned) {
              var shipName = node.getAttribute("name");
              var elem = document.getElementsByClassName(shipName);
              elem[0].classList.add("sunk");
            }
          } else if (val === false) {
            node.style.backgroundColor = "pink";
          }
        });
      });
    },
  };

  global.player = player;
})(this);
