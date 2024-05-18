import { useState } from "react";

function Square({ value, onSquareClick, className }) {
  return (
    <button onClick={onSquareClick} className={`square ${className}`}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, winningSquares, onPlay }) {
  function renderSquare(i) {
    const winHighlight = winningSquares.includes(i) ? "win-highlight" : "";
    return (
      <>
        <Square
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
          key={i}
          className={winHighlight}
        />
      </>
    );
  }

  function handleClick(i) {
    const { winner } = calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    const row = Math.floor(i / 3) + 1;
    const column = (i % 3) + 1;
    onPlay(nextSquares, { row, column });
  }

  function gameInfo(squares, xIsNext) {
    const { winner } = calculateWinner(squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else if (isBoardFull(squares)) {
      status = "Draw";
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return status;
  }

  const status = gameInfo(squares, xIsNext);
  const board = [];
  const boardSize = 3; // Assuming a 3x3 board

  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      const squareIndex = i * boardSize + j;
      row.push(renderSquare(squareIndex));
    }
    board.push(
      <div className="board-row" key={i}>
        {row}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: { row: null, column: null } },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const { lines } = calculateWinner(currentSquares);
  const [isAscending, setIsAscending] = useState(true);

  function handlePlay(nextSquares, location) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location: location },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    let description = move
      ? `Go to move #${move} (${step.location.row}, ${step.location.column})`
      : "Go to game start";

    const stepInfo = move
      ? `You are at move #${move} (${step.location.row}, ${step.location.column}
    )`
      : `Game start`;

    return (
      <div key={move}>
        {move === currentMove ? (
          <span>{stepInfo}</span>
        ) : (
          <li>
            <button onClick={() => jumpTo(move)}>{description}</button>
          </li>
        )}
      </div>
    );
  });

  if (!isAscending) moves.reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          winningSquares={lines}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <div style={{ marginLeft: "38px" }}>
          <button onClick={() => setIsAscending(!isAscending)}>
            {isAscending ? "Sort Descending" : "Sort Ascending"}
          </button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
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

  const result = {
    winner: null,
    lines: [],
  };
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      result["winner"] = squares[a];
      result["lines"] = lines[i];
      return result;
    }
  }
  return result;
}

function isBoardFull(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      return false;
    }
  }
  return true;
}
