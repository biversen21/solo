(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var i = majorDiagonalColumnIndexAtFirstRow;
      var rows = this.rows();
      var count = 0;
      for (var row = 0; row < rows.length; row++) {
        if(rows[row][row + i]) {
          if(rows[row][row + i] === 1) {
            count++;
            if (count > 1) {
              return true;
            }
          }
        }
      }
      return false;
    },

    hasAnyMajorDiagonalConflicts: function() {
      var rowLength = this.rows().length;
      for (var i = -rowLength; i < rowLength; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var i = minorDiagonalColumnIndexAtFirstRow;
      var rows = this.rows();
      var count = 0;
      for (var row = 0; row < rows.length; row++) {
        if(rows[row][i - row]) {
          if(rows[row][i - row] === 1) {
            count++;
            if (count > 1) {
              return true;
            }
          }
        }
      }
      return false;
    },

    hasAnyMinorDiagonalConflicts: function() {
      var rowLength = this.rows().length * 2;
      for (var i = 0; i < rowLength; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    }
  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());


var d3func = function(boards) {
	d3.select('.container').selectAll('p').data(boards).enter().append('p').text(function(d) {return d});
}

var boardObject = {};
var boardsRendered = [];

var renderHtml = function(board, boo) {
	if (boo) {
		var htmlBoard = '<div class="board success">'
	} else {
		var htmlBoard = '<div class="board fail">'
	}
	for (var i = 0; i < board.length; i++) {
		board[i] = board[i].toString().replace(/,/g, ' | ').replace(/1/g, 'Q');
		if (boardObject[i] === board[i]) {
		  htmlBoard += '<span class="has"><u>' + board[i] + '</u></span>' + '<br>';
	  } else {
			boardObject[i] = board[i];
	  	htmlBoard += '<span class="hasnot"><u>  ' + board[i] + '</u></span>' + '<br>';
	  }
	}
	htmlBoard += '</div>';
	// boardsRendered.push(htmlBoard);
	// d3func(boardsRendered);
	$('.container').append(htmlBoard);
}

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
	console.log(n);
  var solutionCount = 0;
  if (n === 0) {
    solutionCount++;
  }
  var boards = [];
  var board = [];

  var generatePossRows = function() {
    var containerArr = [];
    var innerArr = [];
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        if (i === j) {
          innerArr.push(1);
        } else {
          innerArr.push(0);
        }
      }
      containerArr.push(innerArr);
      innerArr = [];
    }
    return containerArr;
  };

  var generateBoard = function() {
    for(var i = 0; i < n; i++) {
      if (board.indexOf(possRows[i]) === -1){
        board.push(possRows[i]);
				var testboard = new Board(board);
				if (!testboard.hasAnyMajorDiagonalConflicts() && !testboard.hasAnyMinorDiagonalConflicts()) {
					// console.log('fail');
				}  
				if (board.length < n) {
          generateBoard();
        }
      }
      if (board.length === n) {
        boards.push(board);
        board = board.slice(0, n-1);
      }
    }
    board.pop();
    return boards;
  };

  var possRows = generatePossRows();
  var possBoards = generateBoard();

  var runner = function(i) {
	  currentBoard = new Board (possBoards[i]);
	  if (!currentBoard.hasAnyMajorDiagonalConflicts() && !currentBoard.hasAnyMinorDiagonalConflicts()) {
	    solutionCount++;
		  renderHtml(possBoards[i], true);
	  } else {
	  	renderHtml(possBoards[i], false);
	  }
	}
	
  var index = 0;
  setInterval(function(){
		if (index < possBoards.length) {
	  	runner(index);
			index++;
		}
  }, 500);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};


$(function(){
	$('.startNqueens').on('click', function(){
    countNQueensSolutions(5);
	})
})

// countNQueensSolutions(5);

