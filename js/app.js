var app = {
  nbRows: 4,
  nbCols: 6,
  start: {
    row: 1,
    col: 1
  },
  end: {
    row: 6,
    col: 6
  },
  current: null,
  direction: 'right', // top, right, bottom, left
  delay: 500,
  init: function() {
    console.log('init');

    app.randomStart();
    app.randomEnd();

    app.initGame();
    app.drawBoard();

    document.getElementById('launchScript').addEventListener('click', app.handleLaunchScriptButton);
  },
  randomStart: function() {
    app.start.row = Math.floor(Math.random() * Math.floor(app.nbRows))+1;
    app.start.col = Math.floor(Math.random() * Math.floor(app.nbCols))+1;
  },
  randomEnd: function() {
    app.end.row = Math.floor(Math.random() * Math.floor(app.nbRows))+1;
    app.end.col = Math.floor(Math.random() * Math.floor(app.nbCols))+1;
  },
  initGame: function() {
    app.current = {
      row: app.start.row,
      col: app.start.col
    };
    app.direction = 'right';
  },
  handleLaunchScriptButton: function() {
    app.initGame();

    // Strating displaying the board
    app.drawBoard();

    // get code
    var codeLines = document.getElementById('userCode').value.split("\n");

    window.setTimeout(function() {
      app.codeLineLoop(codeLines, 0);
    }, app.delay);
  },
  codeLineLoop: function(codeLines, index) {
    var currentLine = codeLines[index];

    var continueReading = app.interpretLine(currentLine);
    if (continueReading) {
      app.drawBoard();

      // Increment
      index++;

      // if still a line to interpret
      if (index < codeLines.length) {
        // Recall same method
        window.setTimeout(function() {
          app.codeLineLoop(codeLines, index);
        }, app.delay);
      } else {
        window.setTimeout(function() {
          app.checkSuccess();
        }, app.delay);
      }
    } else {
      alert('Game over...');
    }
  },
  interpretLine: function(line) {
    if (line == 'turn left') {
      app.turnLeft();
    } else if (line == 'turn right') {
      app.turnRight();
    } else if (line == 'move forward') {
      var moveOk = app.moveForward();
      if (!moveOk) {
        alert('BRAIN ERROR ! out of bounds ...');
        return false;
      }
    } else {
      alert('MEGA ERROR ! unrecognized command "' + line + '"');
      return false;
    }

    return true;
  },
  checkSuccess: function() {
    // if coordinates are ok
    if (app.current.row == app.end.row && app.current.col == app.end.col) {
      alert('You WIINNN !!! congratulations !');
    } else {
      alert('You dramatically failed !');
    }
  },
  drawBoard: function() {
    var boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    var currentRow;
    var currentCell;
    for (var i = 1; i <= app.nbRows; i++) {
      currentRow = document.createElement('div');
      currentRow.classList.add('cellRow');
      currentRow.setAttribute('id', 'row' + i);

      for (var j = 1; j <= app.nbCols; j++) {
        currentCell = document.createElement('div');
        currentCell.classList.add('cell');
        currentCell.classList.add('cell' + j);

        // if start
        if (i == app.start.row && j == app.start.col) {
          currentCell.classList.add('cellStart');
        }
        // if end
        if (i == app.end.row && j == app.end.col) {
          currentCell.classList.add('cellEnd');
        }
        // if current
        if (i == app.current.row && j == app.current.col) {
          // current
          currentCell.classList.add('cellCurrent');
          // direction
          currentCell.classList.add('cellCurrent-' + app.direction);
        }

        currentRow.appendChild(currentCell);
      }

      boardElement.appendChild(currentRow);
    }
  },
  moveForward: function() {
    switch (app.direction) {
      case 'left':
        app.current.col--;
        break;
      case 'right':
        app.current.col++;
        break;
      case 'top':
        app.current.row--;
        break;
      case 'bottom':
        app.current.row++;
        break;
      default:
        console.log('direction unknown : ' + app.direction);
    }

    // if out of bounds => return false
    if (app.current.row < 1) {
      app.current.row = 1;
      console.log('out 1');
      return false;
    } else if (app.current.row > app.nbRows) {
      app.current.row = app.nbRows;
      console.log('out 2');
      return false;
    } else if (app.current.col < 1) {
      app.current.col = 1;
      console.log('out 3');
      return false;
    } else if (app.current.col > app.nbCols) {
      app.current.col = app.nbCols;
      console.log('out 4');
      return false;
    }

    return true;
  },
  turnLeft: function() {
    switch (app.direction) {
      case 'left':
        app.direction = 'bottom';
        break;
      case 'right':
        app.direction = 'top';
        break;
      case 'top':
        app.direction = 'left';
        break;
      case 'bottom':
        app.direction = 'right';
        break;
    }
  },
  turnRight: function() {
    switch (app.direction) {
      case 'left':
        app.direction = 'top';
        break;
      case 'right':
        app.direction = 'bottom';
        break;
      case 'top':
        app.direction = 'right';
        break;
      case 'bottom':
        app.direction = 'left';
        break;
    }
  }
};

document.addEventListener('DOMContentLoaded', app.init);