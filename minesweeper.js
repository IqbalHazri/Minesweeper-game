let board = [];
const rows = 10;
const cols = 10;

let flagsCount = 10;
let correctFlagged = 0;
let minesLocation = [];

let gameOver = false;

window.onload = function() {
    startGame();

    // Add event listener to the restart button
    document.getElementById("newGameButton").addEventListener("click", function() {
        location.reload(); // Refresh the page
    });
}

function setMines() {

    // Generating random mines location
    let minesLeft = flagsCount;
    while(minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);

        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById("flags-count").innerText = flagsCount;
    setMines();

    // Populating the board with divs
    for (let r = 0; r < rows; r++) {
        let row = [];

        for (let c = 0; c < cols; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("mousedown", clickTile);
            document.getElementById("gameBoard").append(tile);
            row.push(tile);
        }

        board.push(row);
    }

    console.log(board)
}

function clickTile(event) {

    let tile = this;
    
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    // Value 2 for left click and value 0 for right click
    if (event.button === 2) {
        
        if (tile.innerText === "") {
            tile.innerText = "🚩";
            flagsCount--;
            
            // Check wether the placed flag is on the correct mine or not
            if (minesLocation.includes(tile.id)) {
                correctFlagged++;
                if (correctFlagged === minesLocation.length) {
                    endGame(true);
                }
            }
        } else if (tile.innerText === "🚩") {
            tile.innerText = "";
            flagsCount++;

            if (minesLocation.includes(tile.id)) {
                correctFlagged--;
            }
        }
        
        document.getElementById("flags-count").innerText = flagsCount;

    } else if (event.button === 0) {

        if (tile.innerText === "") {

            if (minesLocation.includes(tile.id)) {
                gameOver = true;
                revealMines();
                alert("GAME OVER");
                return;
            }

        } else if (tile.innerText === "🚩") {
            return;
        }

        let coords = tile.id.split("-"); // Splitting "0-0" -> ["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        checkMines(r, c);

    }

}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = board [r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMines(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return;
    }

    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }
    
    board[r][c].classList.add("tile-clicked");

    let minesFound = 0;

    // Checking for mines on the adjacent clicked tiles

    //Top 3 of the tiles clicked
    minesFound += checkTiles(r-1, c-1); //topleft
    minesFound += checkTiles(r-1, c); //top
    minesFound += checkTiles(r-1, c+1); //topright

    // Left and right
    minesFound += checkTiles(r, c-1) //left
    minesFound += checkTiles(r, c+1) //right

    //Bottom 3 of the tiles clicked
    minesFound += checkTiles(r+1, c-1); //bottomleft
    minesFound += checkTiles(r+1, c); //bottom
    minesFound += checkTiles(r+1, c+1); //bottomright

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("text" + minesFound.toString());
    } else {
        // Top 3
        checkMines(r-1, c-1); //top left
        checkMines(r-1, c); //top
        checkMines(r-1, c+1); // top right

        // Left and right
        checkMines(r, c-1); //left
        checkMines(r, c+1); //right

        // Bottom 3
        checkMines(r+1, c-1); //bottom left
        checkMines(r+1, c); //bottom
        checkMines(r+1, c+1); // bottom right
    }

}

function checkTiles(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return 0;
    }

    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }

    return 0;
}

function endGame(win) {
    if (win) {
        alert("Congratulations! You won the game!");
    }
    gameOver = true;
    // document.getElementById("newGameButton").style.display = "inline";
}