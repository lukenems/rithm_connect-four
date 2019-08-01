/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < HEIGHT; i++) {
    board.push([]);
    for (let j = 0; j < WIDTH; j++) {
      board[i].push(null);
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "board" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board')

  // TODO: add comment for this code
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  //top row 'head cell', where user will click
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    headCell.classList.add('p1token')
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  //creating a row up to length of HEIGHT
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    //In each row, create a cell which represents each column
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      // y- vertical is first, x-horizontal is second
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  let y = null;
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (!board[i][x]) {
      y = i;
      break;
    }
  }
  //seperate cooradinates
  //find y with available space
  //if not return y = null
  return y;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const pieceDiv = document.createElement("div");
  pieceDiv.classList.add(`piece`, `p${currPlayer}`);
  let boardCell = document.getElementById(`${y}-${x}`);
  boardCell.append(pieceDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
  //reset game code
  setTimeout(() => {
    resetGame()
  }, 2000);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  //theres no coordinate with null-x
  if (y === null) {
    return;
  }


  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;


  placeInTable(y, x);


  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (isBoardFull()) {
    return endGame(`There is a tie!`);
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  let topRow = document.querySelectorAll(`.p${currPlayer}token`);
  currPlayer = (currPlayer === 1) ? 2 : 1;

  //switch top row token color
  console.log(topRow)
  for (let i = 0; i < topRow.length; i++) {
    topRow[i].classList.remove(`p1token`, `p2token`);
    topRow[i].classList.add(`p${currPlayer}token`);
  }

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

function isBoardFull() {
  for (let i = 0; i < board.length; i++) {
    if (!board[i].every((val) => val)) {
      return false;
    }
  }
  return true;
}

function resetGame() {
  board = [];
  makeBoard();
  clearHTMLBoard();
  makeHtmlBoard();
}

function clearHTMLBoard() {
  let board = document.getElementById('board');
  let child = board.lastElementChild;
  while (child) {
    board.removeChild(child);
    child = board.lastElementChild;
  }
}

makeBoard();
makeHtmlBoard();
