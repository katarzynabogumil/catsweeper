class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isCat = false;
        this.isOpen = false;
        this.isFlagged = false;
    }
}

class Board {
    constructor(sizeX, sizeY, cats) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.cats = cats;
    }

    setTiles() {
        var tiles = new Array(this.sizeX);

        // make a board array
        var tiles = Array.from(Array(this.sizeX), (element, indexX) =>
            Array.from(Array(this.sizeY), (element, indexY) => new Tile(indexX, indexY)));

        // plant cats
        tiles.flat(1)
            .map(element => ({
                value: element,
                sort: Math.random()
            }))
            .sort((a, b) => a.sort - b.sort)
            .map(element => element.value)
            .slice(0, this.cats)
            .forEach(element => tiles[element.x][element.y].isCat = true);

        return tiles;
    }

    neighbouringCats(tile) {
        let catCount = 0;
        for (let i = Math.max(tile.x - 1, 0); i < Math.min(tile.x + 2, this.sizeX); i++) {
            for (let j = Math.max(tile.y - 1, 0); j < Math.min(tile.y + 2, this.sizeY); j++) {
                if (tiles[i][j].isCat && tiles[i][j] !== tile) {
                    catCount++;
                }
            }
        }
        return catCount;
    }

    neighbouringFlags(tile) {
        let flagCount = 0;
        for (let i = Math.max(tile.x - 1, 0); i < Math.min(tile.x + 2, this.sizeX); i++) {
            for (let j = Math.max(tile.y - 1, 0); j < Math.min(tile.y + 2, this.sizeY); j++) {
                if (tiles[i][j].isFlagged && tiles[i][j] !== tile) {
                    flagCount++;
                }
            }
        }
        return flagCount;
    }

    // after clicking on a closed, not flagged tile
    check(tile) {
        if (!tile.isOpen) {
            let catNumber = this.neighbouringCats(tile);

            if (tile.isCat) {
                document.querySelector(`[data-x="${tile.x}"][data-y="${tile.y}"]`).classList.remove('closed');
                document.querySelector(`[data-x="${tile.x}"][data-y="${tile.y}"]`).classList.add('open', `type-touchedcat`);
                gameOver();
            } else if (catNumber >= 0) {
                tile.isOpen = true;
                tilesToOpen--;
                if (tilesToOpen === 0) {
                    victory();
                }
                if (catNumber > 0) {
                    // change class to open + number of cats
                    document.querySelector(`[data-x="${tile.x}"][data-y="${tile.y}"]`).classList.remove('closed');
                    document.querySelector(`[data-x="${tile.x}"][data-y="${tile.y}"]`).classList.add('open', `type-${catNumber}`);
                } else {
                    // change class to open
                    document.querySelector(`[data-x="${tile.x}"][data-y="${tile.y}"]`).classList.remove('closed');
                    document.querySelector(`[data-x="${tile.x}"][data-y="${tile.y}"]`).classList.add('open');

                    // run check on neighbouring tiles
                    for (let i = Math.max(tile.x - 1, 0); i < Math.min(tile.x + 2, this.sizeX); i++) {
                        for (let j = Math.max(tile.y - 1, 0); j < Math.min(tile.y + 2, this.sizeY); j++) {
                            if (tiles[i][j] !== tile) {
                                if (tile.isFlagged) {
                                    unflag(tile);
                                }
                                this.check(tiles[i][j]);
                            }
                        }
                    }
                }
            }
        }
    }

    clickFlag(tile) {
        if (tile.isFlagged) {
            unflag(tile);
        } else {
            flag(tile);
        }
    }

    checkAll(clickedTile) {
        let x = clickedTile.dataset.x;
        let y = clickedTile.dataset.y;
        let tile = tiles[x][y];

        let catNumber = this.neighbouringCats(tile);
        let flagNumber = this.neighbouringFlags(tile);

        if (catNumber === flagNumber) {
            for (let i = Math.max(tile.x - 1, 0); i < Math.min(tile.x + 2, this.sizeX); i++) {
                for (let j = Math.max(tile.y - 1, 0); j < Math.min(tile.y + 2, this.sizeY); j++) {
                    if (!tiles[i][j].isOpen && tiles[i][j] !== tile && !tiles[i][j].isFlagged) {
                        this.check(tiles[i][j]);
                    }
                }
            }
        }
    }

    moveCat(tile) {
        tiles.flat(1)
            .filter(element => !element.isCat)
            .map(element => ({
                value: element,
                sort: Math.random()
            }))
            .sort((a, b) => a.sort - b.sort)
            .map(element => element.value)
            .slice(0, 1)
            .forEach(element => tiles[element.x][element.y].isCat = true);

        tile.isCat = false;
    }
}

function flag(tile) {
    if (remainingCats > 0 && !tile.isOpen) {
        tile.isFlagged = true;
        remainingCats--;

        //change display number of cats
        document.querySelector("#cats").innerHTML = (`CATS: ${remainingCats}`)

        // change class to flagged
        document.querySelector(`[data-x="${tile.x}"][data-y="${tile.y}"]`).classList.add('flagged');
    }
}

function unflag(tile) {
    tile.isFlagged = false;
    remainingCats++;
    //change display number of cats
    document.querySelector("#cats").innerHTML = (`CATS: ${remainingCats}`)

    // change class to not flagged
    document.querySelector(`[data-x="${tile.x}"][data-y="${tile.y}"]`).classList.remove('flagged');
}

function displayBoard(board) {
    let table = document.querySelector(".center");
    table.innerHTML = "";
    table.innerHTML += (`<table><thead><tr><th><span id="cats">CATS: ${remainingCats}</span><span id="buttons">
    <div class="mode mouse"></div><div class="mode flagged"></div>
    </span><span id="time">TIME: 0</span></th></tr></thead><tbody id="board"></tbody></table>`);
    document.querySelector(".introduction").innerHTML = "";
    let row;
    let rows = document.querySelector("#board");

    for (let i = 0; i < board.sizeX; i++) {
        rows.innerHTML += (`<tr id="row ${i}"></tr>`);
        row = document.getElementById(`row ${i}`);
        for (let j = 0; j < board.sizeY; j++) {
            row.innerHTML += (`<td id="tile" class="closed" data-x="${i}" data-y="${j}"></td>`);
        }
    }

}

function newGame(board) {
    gameOn = true;
    clickCount = 0;
    flagModeOn = false;
    tiles = board.setTiles();
    remainingCats = board.cats;
    tilesToOpen = board.sizeX * board.sizeY - board.cats;
    time = 0;
    timerOn = true;

    // place html elements
    displayBoard(board);
}

function startTimer() {
    clearTimeout(gameTimer);
    //run timer
    gameTimer = setTimeout(function repeat() {
        timer();
        setTimeout(repeat, 1000);
    });
}

function timer() {
    if (timerOn && time < 999) {
        time++;
        //change display of time
        document.querySelector("#time").innerHTML = (`TIME: ${time}`);
    }
}

function gameOver() {
    // show other cats
    for (let i = 0; i < tiles.length; i++) {
        for (let j = 0; j < tiles[i].length; j++) {
            if (tiles[i][j].isCat && !tiles[i][j].isOpen) {
                tiles[i][j].isOpen = true;
                // change class to 'open type-cat'
                document.querySelector(`[data-x="${i}"][data-y="${j}"]`).classList.remove('closed');
                document.querySelector(`[data-x="${i}"][data-y="${j}"]`).classList.add('open', 'type-cat');
            }
        }
    }
    gameOn = false;
    timerOn = false;
    $('#gameOver').modal('show');
}

function victory() {
    let newScore = {
        time: time,
        level: level
    };
    gameOn = false;
    timerOn = false;

    checkNewScore(newScore);
    $('#victory').modal('show');
}

function checkNewScore(score) {
    if (localStorage.getItem('stored_scores')) {
        let scores = JSON.parse(localStorage.getItem('stored_scores'));
        let lowest = scores[9];

        if (lowest) {
            if (score.level > lowest.level || (score.level === lowest.level && score.score > lowest.score)) {
                saveScore(score, scores);
            }
        } else {
            saveScore(score, scores);
        }
    } else {
        saveScore(score, []);
    }
}

function saveScore(score, scores) {
    scores.push(score);

    scores.sort((a, b) => {
        if (a.level === b.level) {
            return a.time < b.time ? -1 : 1
        } else {
            return a.level < b.level ? -1 : 1
        }
    });

    scores = scores.slice(0, 10)

    localStorage.setItem('stored_scores', JSON.stringify(scores));
}

function displayScores() {
    let storedScores = JSON.parse(localStorage.getItem('stored_scores'));
    let list = document.querySelector("#scoreList");
    if (storedScores) {
        list.innerHTML = "<p><b>Time finished - level:</b></p><ol id=innerList></ol>";

        document.querySelector("#innerList").innerHTML = storedScores
            .map((score) => {
                if (score.level === 3) {
                    score.level = "beginner";
                } else if (score.level === 2) {
                    score.level = "intermediate";
                } else {
                    score.level = "expert";
                }
                return `<li>${score.time}s - ${score.level}`
            })
            .join('');
    } else {
        list.innerHTML = "<p>You have no scores yet.</p>";
    }
}

let tiles, board, remainingCats, tilesToOpen, gameOn, flagModeOn, timerOn, time, level, clickCount, clickTimer, gameTimer;

document.addEventListener('DOMContentLoaded', function() {

    startTimer();

    document.querySelectorAll('#level').forEach(link => {
        link.onclick = () => {
            if (link.dataset.level === 'beginner') {
                board = new Board(9, 9, 10);
                level = 3;
            } else if (link.dataset.level === 'intermediate') {
                board = new Board(16, 16, 40);
                level = 2;
            } else if (link.dataset.level === 'expert') {
                board = new Board(16, 30, 99);
                level = 1;
            }

            newGame(board);

            // change click/ flag mode (especially for mobile users)
            document.querySelector('.mode.mouse').onclick = () => {
                flagModeOn = false;
            };
            document.querySelector('.mode.flagged').onclick = () => {
                flagModeOn = true;
            };

            // listen for clicks on the board
            document.querySelectorAll('#tile.closed').forEach(clickedTile => {
                clickedTile.addEventListener('click', event => {
                    // check if not double click
                    if (event.detail === 1) {
                        clickTimer = setTimeout(() => {
                            let x = clickedTile.dataset.x;
                            let y = clickedTile.dataset.y;
                            let tile = tiles[x][y];
                            if (gameOn) {
                                if (flagModeOn) {
                                    board.clickFlag(tile);
                                } else if (!tile.isFlagged) {
                                    if (clickCount === 0 && tile.isCat) {
                                        board.moveCat(tile);
                                    }
                                    board.check(tile);
                                    clickCount++;
                                }
                            }
                        }, 100)
                    }
                });
            });

            // listen for right clicks on the board
            document.querySelectorAll('#tile.closed').forEach(tile => {
                tile.oncontextmenu = () => {
                    event.preventDefault();
                    let x = tile.dataset.x;
                    let y = tile.dataset.y;
                    if (gameOn) {
                        board.clickFlag(tiles[x][y]);
                    }
                };
            });

            // listen for double clicks on the board
            document.querySelectorAll('#tile').forEach(clickedTile => {
                clickedTile.addEventListener('dblclick', event => {
                    if (event.detail === 2) {
                        clearTimeout(clickTimer);
                        if (gameOn) {
                            board.checkAll(clickedTile);
                        }
                    }
                });
            });
        };
    });

    // if highscores subpage clicked
    document.querySelectorAll('#nav-highscores').forEach(link => {
        link.onclick = () => {
            timerOn = false;
            $('#victory').modal('hide');
            $('#highscores').modal('show');
            displayScores();
        }
    });

    // if rules subpage clicked
    document.querySelector('#nav-rules').onclick = () => {
        timerOn = false;
        $('#rules').modal('show');
    }

    // if highscores subpage clicked
    document.querySelectorAll('#nav-close').forEach(link => {
        link.onclick = () => {
            if (gameOn) {
                timerOn = true;
            }
        }
    });
});
