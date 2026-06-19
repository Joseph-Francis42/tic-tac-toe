import { useState } from 'react';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [playerNames, setPlayerNames] = useState({
    x: 'Player X',
    o: 'Player O',
  });
  const [scores, setScores] = useState({
    x: 0,
    o: 0,
    ties: 0,
  });

  const winnerInfo = calculateWinner(board);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : [];
  const isTie = !winner && board.every((square) => square !== null);

  const handleSquareClick = (index) => {
    // Ignore click if square is filled or game is over
    if (board[index] || winner || isTie) return;

    const newBoard = [...board];
    const currentPlayer = isXNext ? 'X' : 'O';
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setIsXNext(!isXNext);

    // Check winner or tie with the new board state
    const newWinnerInfo = calculateWinner(newBoard);
    if (newWinnerInfo) {
      setScores((prev) => ({
        ...prev,
        x: newWinnerInfo.winner === 'X' ? prev.x + 1 : prev.x,
        o: newWinnerInfo.winner === 'O' ? prev.o + 1 : prev.o,
      }));
    } else if (newBoard.every((square) => square !== null)) {
      setScores((prev) => ({
        ...prev,
        ties: prev.ties + 1,
      }));
    }
  };

  const handleRestartGame = () => {
    // Clears the board for a new game but keeps scores
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const handleResetMatch = () => {
    // Reset scores, board, and turns
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setScores({ x: 0, o: 0, ties: 0 });
  };

  const renderToken = (value) => {
    if (value === 'X') {
      return (
        <span className="token token-x">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
      );
    }
    if (value === 'O') {
      return (
        <span className="token token-o">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9"></circle>
          </svg>
        </span>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel">
      {/* Header */}
      <div className="header">
        <h1 className="title">Tic-Tac-Toe</h1>
        <p className="subtitle">Classic match with custom players</p>
      </div>

      {/* Players Setup */}
      <div className="player-setup">
        <div className="player-input-container">
          <label className="player-label x-label">Player X Name</label>
          <input
            type="text"
            className="player-input"
            value={playerNames.x}
            onChange={(e) =>
              setPlayerNames((prev) => ({ ...prev, x: e.target.value || 'Player X' }))
            }
            maxLength={12}
            placeholder="Player X"
          />
        </div>
        <div className="player-input-container">
          <label className="player-label o-label">Player O Name</label>
          <input
            type="text"
            className="player-input"
            value={playerNames.o}
            onChange={(e) =>
              setPlayerNames((prev) => ({ ...prev, o: e.target.value || 'Player O' }))
            }
            maxLength={12}
            placeholder="Player O"
          />
        </div>
      </div>

      {/* Turn Display / Game Status */}
      <div className="status-bar">
        {winner ? (
          <div className={winner === 'X' ? 'winner-banner-x' : 'winner-banner-o'}>
            🎉 {winner === 'X' ? playerNames.x : playerNames.o} Wins!
          </div>
        ) : isTie ? (
          <div className="tie-banner">🤝 It's a Draw!</div>
        ) : (
          <div className={`turn-indicator ${isXNext ? 'turn-x' : 'turn-o'}`}>
            It is <span style={{ color: isXNext ? 'var(--color-x)' : 'var(--color-o)', fontWeight: 'bold' }}>
              {isXNext ? playerNames.x : playerNames.o}
            </span>
            's turn ({isXNext ? 'X' : 'O'})
          </div>
        )}
      </div>

      {/* ScoreBoard */}
      <div className="scoreboard">
        <div className={`score-card x-card ${isXNext && !winner && !isTie ? 'active-x' : ''}`}>
          <div className="score-name">{playerNames.x}</div>
          <div className="score-value">{scores.x}</div>
        </div>
        <div className="score-card ties-card">
          <div className="score-name">Ties</div>
          <div className="score-value">{scores.ties}</div>
        </div>
        <div className={`score-card o-card ${!isXNext && !winner && !isTie ? 'active-o' : ''}`}>
          <div className="score-name">{playerNames.o}</div>
          <div className="score-value">{scores.o}</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="board-container">
        <div className="board">
          {board.map((value, index) => {
            const isWinningSquare = winningLine.includes(index);
            const winningClass = isWinningSquare ? (value === 'X' ? 'winning-x' : 'winning-o') : '';
            const hoverClass = !value && !winner && !isTie ? (isXNext ? 'hover-x' : 'hover-o') : '';
            
            return (
              <button
                key={index}
                className={`square ${hoverClass} ${winningClass}`}
                onClick={() => handleSquareClick(index)}
                disabled={!!value || !!winner || isTie}
                aria-label={`Square ${index + 1}`}
              >
                {renderToken(value)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Game Controls */}
      <div className="controls">
        <button className="btn btn-primary" onClick={handleRestartGame}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
          </svg>
          Next Round
        </button>
        <button className="btn btn-secondary" onClick={handleResetMatch}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M16 3h5v5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M8 21H3v-5"></path>
          </svg>
          Reset Match
        </button>
      </div>

      {/* Footer */}
      <div className="footer">
        Created with React & Vite
      </div>
    </div>
  );
}

export default App;
