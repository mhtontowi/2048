console.log("2048");

// Data Controller

var dataController = (function() {
    // Code goes here

    // gird is the variable where all the current values in the grid is stored

    // var grid = [
    //     [0, 0, 0, 0],
    //     [0, 0, 0, 0],
    //     [0, 0, 0, 0],
    //     [0, 0, 0, 0]
    // ];

    var grid = [];
    var score = 0;
    var winScore = 2048;

    return {
        winScore: winScore,
        initGrid: function(height, width) {
            grid = [];
            var gridRow;

            for (var i = 0; i < height; i++) {
                gridRow = new Array(width).fill(0);
                grid.push(gridRow);
            }
        },

        getCurrentGrid: function() {
            return grid;
        },

        // testing function for displaying current grid
        showCurrentGrid: function() {
            // console.log(grid);
            for (var i = 0; i < grid.length; i++) {
                var ops = "";
                for (var j = 0; j < grid[0].length; j++) {
                    ops = ops + grid[i][j];
                }
                console.log(ops);
            }
        },

        calculateScore: function() {},

        initScore: function() {
            score = 0;
        },

        getScore: function() {
            return score;
        },

        updateScore: function(addedValue) {
            score += addedValue;
        },

        newTileVal: function() {
            // chances of tile 2 is 9 out of 10 times
            var tileVals, tileVal, pos;

            tileVals = [2, 2, 2, 4, 2, 2, 2, 2, 2, 2];
            pos = Math.floor(Math.random() * 10);
            tileVal = tileVals[pos];

            return tileVal;
        },

        getEmptyLocations: function(currentGrid) {
            var emptyLocations, emptyLocation;

            emptyLocations = [];

            height = currentGrid.length;
            width = currentGrid[0].length;

            for (var i = 0; i < height; i++) {
                for (var j = 0; j < width; j++) {
                    if (currentGrid[i][j] === 0) {
                        emptyLocation = [i, j]; // row, column
                        emptyLocations.push(emptyLocation);
                    }
                }
            }

            return emptyLocations;
        },

        checkAjdacentTile: function(row, col) {
            var currentTileVal = grid[row][col];

            // row, col - 1
            // row, col + 1
            // row - 1, col
            // row + 1, col

            if (col > 0) {
                if (grid[row][col] === grid[row][col - 1]) {
                    return true;
                }
            }

            if (col < grid[0].length - 1) {
                if (grid[row][col] === grid[row][col + 1]) {
                    return true;
                }
            }

            if (row > 0) {
                if (grid[row][col] === grid[row - 1][col]) {
                    return true;
                }
            }

            if (row < grid.length - 1) {
                if (grid[row][col] === grid[row + 1][col]) {
                    return true;
                }
            }

            return false;
        },

        checkGameOver: function(emptyLocations) {
            var gameOver, hasSameAdjacentVal;

            gameOver = false;

            hasSameAdjacentVal = false;

            if (emptyLocations.length === 0) {
                gameOver = true;
                // check if there are any adjacent tiles of same values
                // so that they can be moved

                for (var i = 0; i < grid.length; i++) {
                    if (hasSameAdjacentVal) {
                        // gameOver = false;
                        break;
                    } else {
                        for (var j = 0; j < grid[0].length; j++) {
                            hasSameAdjacentVal = this.checkAjdacentTile(i, j);
                            if (hasSameAdjacentVal) {
                                gameOver = false;
                                break;
                            }
                        }
                    }
                }

                // gameOver = true;
            }

            return gameOver;
        },

        newTileLocation: function(emptyLocations) {
            var length, pos, tileLocation;

            length = emptyLocations.length;
            pos = Math.floor(Math.random() * length);
            tileLocation = emptyLocations[pos];

            return tileLocation;
        },

        updateGrid: function(tileVal, tileLocation) {
            var row, col;
            row = tileLocation[0];
            col = tileLocation[1];
            grid[row][col] = tileVal;
        }
    };
})();

// UI Controller

var uiController = (function() {
    // Code goes here
    var DOMStrings = {
        tile: "#tile-",
        scoreBox: "#score",
        scoreClass: "value-",
        newGame: "#new-game"
    };

    var findClassIfExists = function(classes, classToFind) {
        // console.log(classes);
        var foundClass = "";
        classes.forEach(function(element) {
            if (element.includes(classToFind)) {
                // console.log(element);
                foundClass = element.toString();
            }
        });

        return foundClass;
    };

    // var removeClassIfExists = function(domObject, classToRemove) {
    //     if (classToRemove !== "") {
    //         domObject.classList.remove(classToRemove);
    //     }
    // };

    return {
        DOMStrings: DOMStrings,

        displayGrid: function(currentGrid) {
            var height, width;

            height = currentGrid.length;
            width = currentGrid[0].length;

            for (var i = 0; i < height; i++) {
                for (var j = 0; j < width; j++) {
                    // innertext of the tile
                    // get value of the existing tile
                    // if not zero
                    // then remove the value class
                    // add the new value class
                    var tileVal = currentGrid[i][j];
                    var tileLocation = [i, j];
                    this.placeNewTile(tileVal, tileLocation);
                }
            }
        },

        displayScore: function(currentScore) {
            document.querySelector(DOMStrings.scoreBox).innerText =
                "SCORE: " + currentScore.toString();
        },

        placeNewTile: function(tileVal, tileLocation, animationClass = "") {
            // console.log(tileLocation);
            var newTileId = DOMStrings.tile;

            var newScoreClass = DOMStrings.scoreClass + tileVal.toString();

            tileLocation.forEach(function(cur) {
                newTileId += cur.toString();
            });

            var newTile = document.querySelector(newTileId);

            // newTile.classList.remove("animated", "bounceInDown", "pulse");

            var classes = newTile.classList;
            var valueClass = "";

            valueClass = findClassIfExists(classes, "value");

            // console.log(valueClass);

            if (valueClass !== "") {
                newTile.classList.remove(valueClass);
            }

            if (tileVal !== 0) {
                newTile.classList.add(newScoreClass);
                newTile.innerText = tileVal.toString();

                // if (animationClass !== "") {
                //     newTile.classList.add("animated", animationClass);
                // }
            } else {
                newTile.innerText = "";
            }
        },

        showGameOver: function() {
            // Get the modal and show
            var modal = document.getElementById("gameOverModal");
            modal.style.display = "block";

            // Get the <span> element that closes the modal
            var span = document.querySelector("#closeGameOver");

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            };

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            };
        },

        showWin: function() {
            // Get the modal and show
            var modal = document.getElementById("winModal");
            modal.style.display = "block";

            // Get the <span> element that closes the modal
            var span = document.querySelector("#closeWin");

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            };

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            };
        }
    };
})();

// Main Controller

var controller = (function(dataCtrl, uiCtrl) {
    var DOM = uiCtrl.DOMStrings;

    var newGame = function() {
        console.log("Init");

        // initialize the grid with height and row
        dataCtrl.initGrid(4, 4);

        // show the grid for testing
        // dataCtrl.showCurrentGrid();

        // display grid
        uiCtrl.displayGrid(dataCtrl.getCurrentGrid());

        // set the score to 0
        dataCtrl.initScore();

        // console.log(dataCtrl.getScore());

        // update the score on the UI
        uiCtrl.displayScore(dataCtrl.getScore());

        // new tile
        newTile();
        // newTile();
        // newTile();
        // newTile();
    };

    var init = function() {
        newGame();
        setUpEventListeners();
    };

    var setUpEventListeners = function() {
        document.querySelector(DOM.newGame).addEventListener("click", newGame);

        document.addEventListener("keydown", function(event) {
            if (event.code === "ArrowLeft") {
                // console.log("Left");
                move("left");
            } else if (event.code === "ArrowRight") {
                // console.log("Right");
                move("right");
            } else if (event.code === "ArrowUp") {
                // console.log("Up");
                move("up");
            } else if (event.code === "ArrowDown") {
                // console.log("Down");
                move("down");
            }
        });
    };

    var newTile = function() {
        var currentGrid, emptyLocations, tileVal;

        currentGrid = dataCtrl.getCurrentGrid();
        // console.log(currentGrid);
        emptyLocations = dataCtrl.getEmptyLocations(currentGrid);

        tileVal = dataCtrl.newTileVal();

        var tileLocation;
        tileLocation = dataCtrl.newTileLocation(emptyLocations);

        // uiCtrl.placeNewTile(tileVal, tileLocation, "bounceInDown");
        uiCtrl.placeNewTile(tileVal, tileLocation);

        dataCtrl.updateGrid(tileVal, tileLocation);
    };

    var move = function(direction) {
        var currentGrid = dataCtrl.getCurrentGrid();
        var height, width, hasMoved;
        height = currentGrid.length;
        width = currentGrid[0].length;

        hasMoved = false;

        var stacked = [];

        if (direction === "left") {
            for (var i = 0; i < height; i++) {
                // row
                for (var j = 1; j < width; j++) {
                    // column
                    // currentVal = currentGrid[i][j];

                    // now, row stays the same
                    // check the previous columns in the same row if they are empty

                    // if the immediate left if non-zero, then this tile is not moving
                    // continue to next tile on the row
                    // next tile - the immediate next on the right

                    if (currentGrid[i][j] === 0) {
                        continue;
                    } else {
                        for (var k = j - 1; k >= 0; k--) {
                            if (currentGrid[i][k] !== 0) {
                                break;
                            } else {
                                hasMoved = true;
                                // console.log("moving");
                                currentGrid[i][k] = currentGrid[i][k + 1];
                                currentGrid[i][k + 1] = 0;

                                dataCtrl.updateGrid(currentGrid[i][k], [i, k]);
                                dataCtrl.updateGrid(0, [i, k + 1]);
                            }
                        }
                    }
                }
            }

            // now adding the adjacent same valued tiles together

            for (var i = 0; i < height; i++) {
                for (var j = 0; j < width - 1; j++) {
                    if (currentGrid[i][j] === 0) {
                        continue;
                    } else if (currentGrid[i][j] === currentGrid[i][j + 1]) {
                        hasMoved = true;
                        // console.log("moving moving");
                        var addedValue = currentGrid[i][j] * 2;
                        currentGrid[i][j] = addedValue;
                        currentGrid[i][j + 1] = 0;

                        dataCtrl.updateGrid(currentGrid[i][j], [i, j]);
                        stacked.push([i, j]);

                        dataCtrl.updateScore(addedValue);
                        uiCtrl.displayScore(dataCtrl.getScore());

                        if (addedValue === dataCtrl.winScore) {
                            uiCtrl.showWin();
                        }

                        // now shift one tile left for all the tiles from the right

                        for (var k = j + 1; k < width - 1; k++) {
                            currentGrid[i][k] = currentGrid[i][k + 1];
                            dataCtrl.updateGrid(currentGrid[i][k + 1], [i, k]);
                            currentGrid[i][k + 1] = 0;
                            dataCtrl.updateGrid(0, [i, k + 1]);
                        }
                    }
                }
            }
        } else if (direction === "right") {
            for (var i = 0; i < height; i++) {
                // row
                for (var j = width - 2; j >= 0; j--) {
                    // column
                    if (currentGrid[i][j] === 0) {
                        continue;
                    } else {
                        for (var k = j + 1; k < width; k++) {
                            if (currentGrid[i][k] !== 0) {
                                break;
                            } else {
                                hasMoved = true;
                                // console.log("moving");
                                currentGrid[i][k] = currentGrid[i][k - 1];
                                currentGrid[i][k - 1] = 0;

                                dataCtrl.updateGrid(currentGrid[i][k], [i, k]);
                                dataCtrl.updateGrid(0, [i, k - 1]);
                            }
                        }
                    }
                }
            }

            // now adding the adjacent same valued tiles together

            for (var i = 0; i < height; i++) {
                for (var j = width - 1; j >= 0; j--) {
                    if (currentGrid[i][j] === 0) {
                        continue;
                    } else if (currentGrid[i][j] === currentGrid[i][j - 1]) {
                        hasMoved = true;
                        // console.log("moving moving");
                        var addedValue = currentGrid[i][j] * 2;
                        currentGrid[i][j] = addedValue;
                        currentGrid[i][j - 1] = 0;

                        dataCtrl.updateGrid(currentGrid[i][j], [i, j]);
                        stacked.push([i, j]);

                        dataCtrl.updateScore(addedValue);
                        uiCtrl.displayScore(dataCtrl.getScore());

                        if (addedValue === dataCtrl.winScore) {
                            uiCtrl.showWin();
                        }

                        // now shift one tile right for all the tiles from the left

                        for (var k = j - 1; k > 0; k--) {
                            currentGrid[i][k] = currentGrid[i][k - 1];
                            dataCtrl.updateGrid(currentGrid[i][k - 1], [i, k]);
                            currentGrid[i][k - 1] = 0;
                            dataCtrl.updateGrid(0, [i, k - 1]);
                        }
                    }
                }
            }
        } else if (direction === "up") {
            for (var j = 0; j < width; j++) {
                // column
                for (var i = 1; i < height; i++) {
                    // row
                    if (currentGrid[i][j] === 0) {
                        continue;
                    } else {
                        for (var k = i - 1; k >= 0; k--) {
                            if (currentGrid[k][j] !== 0) {
                                break;
                            } else {
                                hasMoved = true;
                                // console.log("moving");
                                currentGrid[k][j] = currentGrid[k + 1][j];
                                currentGrid[k + 1][j] = 0;

                                dataCtrl.updateGrid(currentGrid[k][j], [k, j]);
                                dataCtrl.updateGrid(0, [k + 1, j]);
                            }
                        }
                    }
                }
            }

            // now adding the adjacent same valued tiles together

            for (var j = 0; j < width; j++) {
                for (var i = 0; i < height - 1; i++) {
                    if (currentGrid[i][j] === 0) {
                        continue;
                    } else if (currentGrid[i][j] === currentGrid[i + 1][j]) {
                        hasMoved = true;
                        // console.log("moving moving");
                        var addedValue = currentGrid[i][j] * 2;
                        currentGrid[i][j] = addedValue;
                        currentGrid[i + 1][j] = 0;
                        dataCtrl.updateGrid(currentGrid[i][j], [i, j]);
                        stacked.push([i, j]);

                        dataCtrl.updateScore(addedValue);
                        uiCtrl.displayScore(dataCtrl.getScore());

                        if (addedValue === dataCtrl.winScore) {
                            uiCtrl.showWin();
                        }

                        // now shift one tile up for all the tiles from below
                        for (var k = i + 1; k < height - 1; k++) {
                            currentGrid[k][j] = currentGrid[k + 1][j];
                            dataCtrl.updateGrid(currentGrid[k + 1][j], [k, j]);
                            currentGrid[k + 1][j] = 0;
                            dataCtrl.updateGrid(0, [k + 1, j]);
                        }
                    }
                }
            }
        } else if (direction === "down") {
            for (var j = 0; j < width; j++) {
                // column
                for (var i = height - 2; i >= 0; i--) {
                    // row
                    if (currentGrid[i][j] === 0) {
                        continue;
                    } else {
                        for (var k = i + 1; k < height; k++) {
                            if (currentGrid[k][j] !== 0) {
                                break;
                            } else {
                                hasMoved = true;
                                // console.log("moving");
                                currentGrid[k][j] = currentGrid[k - 1][j];
                                currentGrid[k - 1][j] = 0;

                                dataCtrl.updateGrid(currentGrid[k][j], [k, j]);
                                dataCtrl.updateGrid(0, [k - 1, j]);
                            }
                        }
                    }
                }
            }

            // now adding the adjacent same valued tiles together

            for (var j = 0; j < width; j++) {
                for (var i = height - 1; i > 0; i--) {
                    if (currentGrid[i][j] === 0) {
                        continue;
                    } else if (currentGrid[i][j] === currentGrid[i - 1][j]) {
                        hasMoved = true;
                        // console.log("moving moving");

                        var addedValue = currentGrid[i][j] * 2;
                        currentGrid[i][j] = addedValue;
                        currentGrid[i - 1][j] = 0;
                        dataCtrl.updateGrid(currentGrid[i][j], [i, j]);
                        stacked.push([i, j]);

                        dataCtrl.updateScore(addedValue);
                        uiCtrl.displayScore(dataCtrl.getScore());

                        if (addedValue === dataCtrl.winScore) {
                            uiCtrl.showWin();
                        }

                        // now shift one tile down for all the tiles from above
                        for (var k = i - 1; k > 0; k--) {
                            currentGrid[k][j] = currentGrid[k - 1][j];
                            dataCtrl.updateGrid(currentGrid[k - 1][j], [k, j]);
                            currentGrid[k - 1][j] = 0;
                            dataCtrl.updateGrid(0, [k - 1, j]);
                        }
                    }
                }
            }
        }

        // display grid
        uiCtrl.displayGrid(dataCtrl.getCurrentGrid());
        if (hasMoved) {
            newTile();
        }

        // dataCtrl.showCurrentGrid();

        // now check if game over or not

        var gameOver = dataCtrl.checkGameOver(
            dataCtrl.getEmptyLocations(dataCtrl.getCurrentGrid())
        );
        if (gameOver) {
            uiCtrl.showGameOver();
        }
    };

    return {
        init: init,
        newTile: newTile,
        showGameOver: uiCtrl.showGameOver,
        displayScore: uiCtrl.displayScore
    };
})(dataController, uiController);

controller.init();
