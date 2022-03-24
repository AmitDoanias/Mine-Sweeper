'use strict'

// var gLevel = {
//     SIZE: 4,
//     MINES: 2
// };
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    // secsPassed: 0,
    lives: 3,
    level: { size: 4, mines: 2 },
    firstCellClickPos: false,
};
//--------------------------------------------------------------------------------------------------------------------------
const MINE = '💣';
const FLAG = '⛳';
const LIFE = '❤️'
const PLAYING = '🤔'
const WIN = '😎'
const LOSE = '😔'

var gBoard;
var gNumOfCells = Math.pow(gGame.level.size, 2)
var gFirstCellClick;

var gRandomMinesIdx = [];



function initGame(pos) {
    gBoard = buildBoard(gGame.level.size)
    gGame.isOn = true;
    renderHearts();
    renderBoard(gBoard);
    // addRandomMines(gGame.level.size, gGame.level.mines, pos)
    // setMinesNegsCount(gBoard);
}

function buildBoard(num) {
    var board = [];
    for (var i = 0; i < gGame.level.size; i++) {
        board[i] = [];
        for (var j = 0; j < gGame.level.size; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false };
        }
    }
    return board;
}

function renderBoard(gBoard) {
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            var pos = `pos: ${i},${j}`
            var numMinesAround = cell.minesAroundCount
            var className = (cell.isMine) ? 'is-mine' : '';
            if (cell.isShown) className += ' is-shown';
            if (cell.isMarked) className += ' is-marked';
            if (cell.minesAroundCount) className += ' minesAround'
            strHTML += `\t<td cell = "${pos}" class="${className}" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(event,${i},${j})">`
            strHTML += (cell.isMine && cell.isShown) ? `${MINE}` : ''
            strHTML += (cell.isMarked && cell.isShown) ? `${FLAG}` : ''
            strHTML += (numMinesAround && cell.isShown && !cell.isMine && !cell.isMarked) ? `${cell.minesAroundCount}` : ' '
            strHTML += `</td>\n`
        }
        strHTML += `</tr>\n`
    }
    var elCells = document.querySelector('.board');
    elCells.innerHTML = strHTML;
}
function cellClicked(elCell, i, j) {
    gNumOfCells = Math.pow(gGame.level.size, 2)
    if (gGame.isOn) {
        var cell = gBoard[i][j];
        var pos = { i: i, j: j }
        if (!gGame.firstCellClickPos) {
            gGame.firstCellClickPos = pos;
            addRandomMines();
            setMinesNegsCount();
            startTime();
            gGame.isOn = true;

        }
        if (!cell.minesAroundCount && !cell.isMine) expandShown(pos)
        if (gBoard[i][j].isMine) checkGameOver();
        if (gBoard[i][j].FLAG) gGame.markedCount++
        if (!gBoard[i][j].isMine && !gBoard[i][j].FLAG && !gBoard[i][j].isShown) gGame.shownCount++;
        cell.isShown = true;
        if (gGame.markedCount + gGame.shownCount === gNumOfCells) victory() // WIN

        renderBoard(gBoard)
    }
}
function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = { i: i, j: j }
            gBoard[i][j].minesAroundCount = findNeighbors(cell);
        }
    }
}

function findNeighbors(pos) {
    var countNeighborsMines = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === pos.i && j === pos.j) continue
            if (!gBoard[i][j].isMine) continue
            countNeighborsMines++;
        }
    }
    return countNeighborsMines;
}


function expandShown(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === pos.i && j === pos.j) continue
            if (!gBoard[i][j].isMine) {
                // console.log('gGame.shownCount', gGame.shownCount)
                if (!gBoard[i][j].isShown) gGame.shownCount++
                gBoard[i][j].isShown = true;
            }
        }
    }
}


function addRandomMines() {
    var numOfmines = gGame.level.mines;
    while (numOfmines > 0) {
        var iPos = getRandomIntInclusive(0, gGame.level.size - 1)
        var jPos = getRandomIntInclusive(0, gGame.level.size - 1)
        if (!gBoard[iPos][jPos].isMine && gGame.firstCellClickPos.i != iPos && gGame.firstCellClickPos.j != jPos) {
            gBoard[iPos][jPos].isMine = true
            numOfmines--;
        }
        // renderBoard(gBoard)
    }
}

function cellMarked(ev, i, j) {
    var currCell = gBoard[i][j]
    if (!currCell.isShown && currCell.isMine) {
        currCell.isMine = false;
        gGame.markedCount++;
        console.log('gGame.markedCount', gGame.markedCount)
        currCell.isMarked = true;
        currCell.isShown = true;
    }
    else if (!currCell.isShown) {
        currCell.isMarked = true;
        currCell.isShown = true;

    }
    else if (currCell.isMarked && currCell.isShown) {
        currCell.isMarked = false;
        currCell.isShown = false;
    }
    cellClicked(ev, i, j)
    ev.preventDefault();
}


function checkGameOver() {
    gGame.lives--;
    renderHearts();
    if (gGame.lives === 0) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
            }
        }
        stopTime()
    }
}

function renderHearts() {
    var elHeart = document.querySelector('.heart')
    var strText = ''
    for (var i = 0; i < gGame.lives; i++) {
        strText += LIFE;
    }
    elHeart.innerText = strText;
}

function renderSmile() {
    var elSmile = document.querySelector('.smile')
    var strText = ''
}

function changeLevel(size, mines) {
    gGame.level.size = size;
    gGame.level.mines = mines
    resetGame();
}

function victory() {
    renderSmile
    stopTime()
}

function resetGame() {
    //update the model
    gGame.isOn = false;
    gGame.lives = 3;
    gGame.shownCount = 0
    gGame.markedCount = 0;
    gGame.firstCellClickPos = false;
    stopTime();
    initGame();
}

// for (var i = 0; i < gHeartCount; i++) {
//     strText += LIFE
// }
// if (!strText) {
//     gElHeart.innerText = '⚠️'
//     return
// }
// gElHeart.innerText = strText
// return
// }
