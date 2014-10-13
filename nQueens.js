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

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // return ((rowIndex.indexOf(1) !== rowIndex.lastIndexOf(1)) && (rowIndex.indexOf(1) > -1 && rowIndex.lastIndexOf(1) > -1)) ? false : true;
      var counter = 0;
      for(var i=0; i<rowIndex.length; i++){
        if (rowIndex[i] === 1){
          counter++;
        }
      }
      return (counter >= 2 ? true : false);
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var currentRows = this.rows();
      var hasConflict = false;
      for (var i = 0; i < currentRows.length; i++) {
        hasConflict = this.hasRowConflictAt(currentRows[i]);
        if (hasConflict){
          return true;
        }
      }
      return hasConflict;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var counter = 0;
      for(var i=0; i<colIndex.length; i++){
        if (colIndex[i] === 1){
          counter++;
        }
      }
      return (counter >= 2 ? true : false);
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var currentRows = this.rows();
      var rowLength = this.rows().length;
      var currentCol = [];
      var hasConflict = false;
      for (var i=0; i<rowLength; i++){
        currentCol = [];
        for(var j=0; j<rowLength; j++){
          currentCol.push(currentRows[j][i]);
        }
        hasConflict = this.hasColConflictAt(currentCol);
        if (hasConflict) {
          return true;
        }
      }
      return hasConflict;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
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

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var rowLength = this.rows().length;
      for (var i = -rowLength; i < rowLength; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
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

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var rowLength = this.rows().length * 2;
      for (var i = 0; i < rowLength; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

var renderHtml = function(board) {
	var htmlBoard = '<div class="board">'
	for (var i = 0; i < board.length; i++) {
		htmlBoard += board[i] + '<br>';
	}
	htmlBoard += '</div>'
	$('.container').append(htmlBoard);
}

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
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
        if (board.length < n) {
          generateBoard();
        }
      }
      if (board.length === n) {
        boards.push(board);
				renderHtml(board);
        board = board.slice(0 ,n-1);
      }
    }
    board.pop();
    return boards;
  };

  var possRows = generatePossRows();
  var possBoards = generateBoard();

  var currentBoard;
  for(var i = 0; i < possBoards.length; i++) {
    currentBoard = new Board (possBoards[i]);
    if (!currentBoard.hasAnyColConflicts()) {
      if (!currentBoard.hasAnyMajorDiagonalConflicts()) {
        if(!currentBoard.hasAnyMinorDiagonalConflicts()) {
          solutionCount++;
        }
      }
    }
  }

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

countNQueensSolutions(5);

// $(function(){
// 	$('.startNqueens').on('click', function(){
// 		var start = $('#nqueensNum').val();
//     console.log(start);
// 		countNQueensSolutions(start);
// 	})
// })


