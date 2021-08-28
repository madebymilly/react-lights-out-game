import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {

  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.3
  }

  constructor(props) {
    super(props);

    this.state = {
      board: this.createBoard(),
      hasWon: false
    }

    this.flipCellsAround = this.flipCellsAround.bind(this)
    
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {

    function getValue( chance ) {
      return Math.random() < chance;
    }

    // Create array-of-arrays of true/false values
    let board = [];
    for (let i=0; i<this.props.nrows; i++) {
      board.push(Array.from({length: this.props.ncols}, (v, i) => getValue( this.props.chanceLightStartsOn )));
    }
    return board
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let {ncols, nrows} = this.props;
    let tempBoard = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        tempBoard[y][x] = !tempBoard[y][x];
      }
    }

    // Flip this cell and the cells around it
    flipCell(y, x);
    // Flip up cell:
    flipCell(y-1, x);
    // Flip right cell:
    flipCell(y, x+1);
    // Flip bottom cell:
    flipCell(y+1, x);
    // Flip left cell:
    flipCell(y, x-1);

    // Determine is the game has been won
    // use every():
    let hasWon = tempBoard.every( row => row.every(cell => cell === false))

    this.setState({
      board: tempBoard, 
      hasWon
    });
  }


  /** Render game board or winning message. */

  render() {

    // if the game is won, just show a winning msg & render nothing else
    return (
      <div className="Board">
        <div class="Board-title">
          <span class="neon">Lights</span>
          <span class="flux">Out</span>
        </div>
        {!this.state.hasWon 
        ? <table className="Board-table">
            <tbody>
              {this.state.board.map((row, i) =>
                <tr key={i}>
                  {row.map((cell, j) =>
                    <Cell 
                      key={`${i}-${j}`} 
                      coord={`${i}-${j}`}
                      isLit={cell} 
                      flipCellsAroundMe={this.flipCellsAround}
                    />
                  )}
                </tr>
              )}
            </tbody>
          </table>
        : <h1>You have won the game!</h1>
        }
      </div>
    )
  }
}


export default Board;
