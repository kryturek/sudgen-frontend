import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [removedCount, setRemovedCount] = useState(0);

  // Function to fetch puzzle from the FastAPI endpoint
  const fetchPuzzle = async () => {
    try {
      const response = await fetch('http://localhost:8000/sudoku?removals=50');
      const data = await response.json();
      setPuzzle(data.puzzle);
      setSolution(data.solution);
      setRemovedCount(data.removed_count);
    } catch (error) {
      console.error('Error fetching puzzle:', error);
    }
  };

  useEffect(() => {
    fetchPuzzle();
  }, []);

  return (
    <div className="App" style={{ textAlign: 'center' }}>
      <h1>Sudoku Puzzle</h1>
      {puzzle ? (
        <>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
            <tbody>
              {puzzle.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        width: '30px',
                        height: '30px',
                        border: '1px solid #333',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        fontSize: '20px',
                      }}
                    >
                      {cell !== 0 ? cell : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p>{removedCount} cells were removed to generate the puzzle.</p>
          <h2>Solution</h2>
          <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
            <tbody>
              {solution.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        width: '30px',
                        height: '30px',
                        border: '1px solid #333',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        fontSize: '20px',
                      }}
                    >
                      {cell}
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