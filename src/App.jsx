import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [originalPuzzle, setOriginalPuzzle] = useState(null);
  const [userPuzzle, setUserPuzzle] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const inputRefs = useRef([]);

  // Function to fetch puzzle from the FastAPI endpoint
  const fetchPuzzle = async () => {
    try {
      const response = await fetch('http://localhost:8000/sudoku?removals=50');
      const data = await response.json();
      setPuzzle(data.puzzle);
      setSolution(data.solution);
      setOriginalPuzzle(data.puzzle);
      setUserPuzzle(data.puzzle);
      setIsSolved(false);
    } catch (error) {
      console.error('Error fetching puzzle:', error);
    }
  };

  const handleSolve = () => {
    if (isSolved) {
      setPuzzle(userPuzzle);
    } else {
      setUserPuzzle(puzzle);
      setPuzzle(solution);
    }
    setIsSolved(!isSolved);
  };

  const handleChange = (rowIndex, cellIndex, value) => {
    if (value.length > 1) return;
    const newPuzzle = puzzle.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === cellIndex ? value : cell))
    );
    setPuzzle(newPuzzle);
  };

  const handleKeyDown = (e, rowIndex, cellIndex) => {
    if (e.key === 'ArrowUp' && rowIndex > 0) {
      inputRefs.current[(rowIndex - 1) * 9 + cellIndex].focus();
    } else if (e.key === 'ArrowDown' && rowIndex < 8) {
      inputRefs.current[(rowIndex + 1) * 9 + cellIndex].focus();
    } else if (e.key === 'ArrowLeft' && cellIndex > 0) {
      inputRefs.current[rowIndex * 9 + (cellIndex - 1)].focus();
    } else if (e.key === 'ArrowRight' && cellIndex < 8) {
      inputRefs.current[rowIndex * 9 + (cellIndex + 1)].focus();
    }
  };

  useEffect(() => {
    fetchPuzzle();
  }, []);

  return (
    <div className="App" style={{ textAlign: 'center' }}>
      <h1>Sudoku Puzzle</h1>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={fetchPuzzle} style={{ marginRight: '10px' }}>New Puzzle</button>
        <button onClick={handleSolve}>{isSolved ? 'Unsolve' : 'Solve'}</button>
      </div>
      {puzzle ? (
        <>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <tbody>
              {puzzle.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        width: '40px',
                        height: '40px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        fontSize: '24px',
                        borderTop: rowIndex % 3 === 0 ? '2px solid #000' : '1px solid #333',
                        borderLeft: cellIndex % 3 === 0 ? '2px solid #000' : '1px solid #333',
                        borderRight: (cellIndex + 1) % 3 === 0 ? '2px solid #000' : '1px solid #333',
                        borderBottom: (rowIndex + 1) % 3 === 0 ? '2px solid #000' : '1px solid #333',
                        padding: 0,
                      }}
                    >
                      {originalPuzzle[rowIndex][cellIndex] !== 0 ? (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            lineHeight: '40px',
                            color: '#000',
                          }}
                          tabIndex={-1}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, cellIndex)}
                          ref={(el) => (inputRefs.current[rowIndex * 9 + cellIndex] = el)}
                        >
                          {cell}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={cell === 0 ? '' : cell}
                          onChange={(e) => handleChange(rowIndex, cellIndex, e.target.value.replace(/[^1-9]/, ''))}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, cellIndex)}
                          ref={(el) => (inputRefs.current[rowIndex * 9 + cellIndex] = el)}
                          style={{
                            width: '100%',
                            height: '100%',
                            textAlign: 'center',
                            fontSize: '24px',
                            border: 'none',
                            outline: 'none',
                            padding: 0,
                            margin: 0,
                            boxSizing: 'border-box',
                            color: '#676767', // Dark gray color for user input
                          }}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading puzzle...</p>
      )}
    </div>
  );
}

export default App;