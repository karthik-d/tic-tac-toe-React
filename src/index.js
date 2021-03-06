import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
        {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(idx){
    return (
      <Square
        value={this.props.squares[idx]}
        onClick={() => this.props.onClick(idx)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}


class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      instanceNumber: 0,
      nextIsX: true,
    };
  }

  rollbackTo(inst_num){
    this.setState({
      history: this.state.history.slice(0, inst_num+1),
      instanceNumber: inst_num,
      nextIsX: (inst_num%2 == 0),
    })
  }

  handleClick(idx){
    let history = this.state.history;
    let board = history[history.length-1];
    let squares = board.squares.slice();

    if(squares[idx] || declareWinner(squares)){
      return;
    }
    squares[idx] = this.state.nextIsX ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      instanceNumber: history.length,
      nextIsX: !this.state.nextIsX,
    });
  }

  render() {
    let history = this.state.history;
    let board = history[this.state.instanceNumber];
    let winner = declareWinner(board.squares);
    let status;
    if(winner){
      status = winner + " Won!";
    }
    else{
      status = (this.state.nextIsX ? 'X' : 'O') + "'s turn";
    }

    let instances = history.map((squares, idx) => {
      const content = "Rollback to " + (idx ? "move #"+idx : "beginning");
      return (
        <li key={idx}>
          <button onClick={() => this.rollbackTo(idx)}>
            {content}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={board.squares}
            onClick={(idx) => this.handleClick(idx)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{instances}</ol>
        </div>
      </div>
    );
  }
}

function declareWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
