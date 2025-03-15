import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { getMockPuzzle } from './mockPuzzles';
import { AuthDialog } from './components/AuthDialog';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';

function App() {
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [originalPuzzle, setOriginalPuzzle] = useState(null);
  const [userPuzzle, setUserPuzzle] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [pencilMarks, setPencilMarks] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [focusedCell, setFocusedCell] = useState(null);
  const inputRefs = useRef([]);

  // Add new state variables
  const [showDialog, setShowDialog] = useState(false);
  const [removalsCount, setRemovalsCount] = useState(30);
  const [previewPuzzle, setPreviewPuzzle] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { isAuthenticated, saveGame } = useAuth();

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  // Function to fetch puzzle from the FastAPI endpoint
  const fetchPuzzle = async (removals) => {
    try {
      const response = await fetch(`http://localhost:8000/sudoku?removals=${removals}`);
      const data = await response.json();
      setPuzzle(data.puzzle);
      setSolution(data.solution);
      setOriginalPuzzle(data.puzzle);
      setUserPuzzle(data.puzzle);
      setIsSolved(false);
      setPencilMarks({});
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

  const handleNumberInput = (rowIndex, cellIndex, number) => {
    // Check if the cell is part of the original puzzle
    if (originalPuzzle[rowIndex][cellIndex] !== 0) {
      return; // Don't allow changes to original numbers
    }

    const newPuzzle = puzzle.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === cellIndex ? number : cell))
    );
    setPuzzle(newPuzzle);
    const cellKey = `${rowIndex}-${cellIndex}`;
    if (pencilMarks[cellKey]) {
      const newMarks = { ...pencilMarks };
      delete newMarks[cellKey];
      setPencilMarks(newMarks);
    }
  };

  const getPencilMarkNumber = (key) => {
    const keyMap = {
      'q': 1, 'w': 2, 'e': 3,
      'a': 4, 's': 5, 'd': 6,
      'z': 7, 'x': 8, 'c': 9
    };
    return keyMap[key.toLowerCase()];
  };

  const handleKeyDown = (e, rowIndex, cellIndex) => {
    // Don't handle any key events for original numbers except arrow navigation
    if (originalPuzzle[rowIndex][cellIndex] !== 0) {
      if (e.key.startsWith('Arrow')) {
        // Only allow arrow key navigation
        if (e.key === 'ArrowUp' && rowIndex > 0) {
          e.preventDefault();
          inputRefs.current[(rowIndex - 1) * 9 + cellIndex].focus();
        } else if (e.key === 'ArrowDown' && rowIndex < 8) {
          e.preventDefault();
          inputRefs.current[(rowIndex + 1) * 9 + cellIndex].focus();
        } else if (e.key === 'ArrowLeft' && cellIndex > 0) {
          e.preventDefault();
          inputRefs.current[rowIndex * 9 + (cellIndex - 1)].focus();
        } else if (e.key === 'ArrowRight' && cellIndex < 8) {
          e.preventDefault();
          inputRefs.current[rowIndex * 9 + (cellIndex + 1)].focus();
        }
      }
      return;
    }

    // Rest of the existing handleKeyDown logic for non-original numbers
    if (e.shiftKey) {
      const pencilNumber = getPencilMarkNumber(e.key);
      // Check if the cell is empty (no number) before allowing pencil marks
      if (pencilNumber && puzzle[rowIndex][cellIndex] === 0) {
        e.preventDefault();
        const mark = pencilNumber;
        const cellKey = `${rowIndex}-${cellIndex}`;
        setPencilMarks(prevMarks => {
          const newMarks = { ...prevMarks };
          const currentMarks = newMarks[cellKey] ? Array.from(newMarks[cellKey]) : [];
          const markIndex = currentMarks.indexOf(mark);
          
          if (markIndex === -1) {
            currentMarks.push(mark);
          } else {
            currentMarks.splice(markIndex, 1);
          }
          
          if (currentMarks.length === 0) {
            delete newMarks[cellKey];
          } else {
            newMarks[cellKey] = new Set(currentMarks);
          }
          return newMarks;
        });
      } else if (e.key === 'ArrowUp' && rowIndex > 2) {
        e.preventDefault();
        inputRefs.current[(rowIndex - 3) * 9 + cellIndex].focus();
      } else if (e.key === 'ArrowDown' && rowIndex < 6) {
        e.preventDefault();
        inputRefs.current[(rowIndex + 3) * 9 + cellIndex].focus();
      } else if (e.key === 'ArrowLeft' && cellIndex > 2) {
        e.preventDefault();
        inputRefs.current[rowIndex * 9 + (cellIndex - 3)].focus();
      } else if (e.key === 'ArrowRight' && cellIndex < 6) {
        e.preventDefault();
        inputRefs.current[rowIndex * 9 + (cellIndex + 3)].focus();
      }
    } else {
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        handleNumberInput(rowIndex, cellIndex, parseInt(e.key, 10));
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleNumberInput(rowIndex, cellIndex, 0);
      } else if (e.key === 'ArrowUp' && rowIndex > 0) {
        e.preventDefault();
        inputRefs.current[(rowIndex - 1) * 9 + cellIndex].focus();
      } else if (e.key === 'ArrowDown' && rowIndex < 8) {
        e.preventDefault();
        inputRefs.current[(rowIndex + 1) * 9 + cellIndex].focus();
      } else if (e.key === 'ArrowLeft' && cellIndex > 0) {
        e.preventDefault();
        inputRefs.current[rowIndex * 9 + (cellIndex - 1)].focus();
      } else if (e.key === 'ArrowRight' && cellIndex < 8) {
        e.preventDefault();
        inputRefs.current[rowIndex * 9 + (cellIndex + 1)].focus();
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    }
  };

  const cleanPuzzleData = (puzzle) => {
    return puzzle.map(row => row.map(cell => (cell === '' ? 0 : parseInt(cell, 10))));
  };

  const handleSubmit = async () => {
    const cleanedPuzzle = cleanPuzzleData(puzzle);
    const isFilled = cleanedPuzzle.every(row => row.every(cell => cell !== 0));
    if (!isFilled) {
      alert('Please fill in all cells before submitting.');
      return;
    }
    const puzzleString = JSON.stringify(cleanedPuzzle);
    const solutionString = JSON.stringify(solution);
    if (puzzleString === solutionString) {
      alert('Congratulations! You solved the puzzle correctly.');
      if (isAuthenticated && puzzleString === solutionString) {
        // Save completed game
        await saveGame({
          puzzle,
          solution,
          pencilMarks,
          difficulty: removalsCount,
          startedAt: new Date(),
          lastPlayed: new Date(),
          completed: true
        });
      }
    } else {
      alert('Incorrect solution. Please try again.');
    }
  };

  const handleNewGame = () => {
    setShowDialog(true);
    // Initialize preview with current removalsCount
    setPreviewPuzzle(getMockPuzzle(removalsCount));
  };

  const handleDialogConfirm = () => {
    setShowDialog(false);
    fetchPuzzle(removalsCount); // Only generate puzzle when Start is clicked
  };

  // Update removalsCount handler to show preview
  const handleRemovalsChange = (newCount) => {
    setRemovalsCount(newCount);
    setPreviewPuzzle(getMockPuzzle(newCount));
  };

  useEffect(() => {
    fetchPuzzle(30); // Initial puzzle load only
  }, []); 

  const getHighlightClass = (rowIndex, cellIndex) => {
    if (!focusedCell) return '';
    
    const [focusedRow, focusedCol] = focusedCell;
    const focusedNumber = puzzle[focusedRow][focusedCol];
    
    // Check if cell is the focused one
    if (rowIndex === focusedRow && cellIndex === focusedCol) {
      return 'highlight-focus';
    }
    
    // Check if cell has the same number as the focused cell
    if (focusedNumber !== 0 && puzzle[rowIndex][cellIndex] === focusedNumber) {
      return 'highlight-focus';
    }
    
    // Check if cell is in the same row, column, or 3x3 box
    if (rowIndex === focusedRow || 
        cellIndex === focusedCol || 
        (Math.floor(rowIndex/3) === Math.floor(focusedRow/3) && 
         Math.floor(cellIndex/3) === Math.floor(focusedCol/3))) {
      return 'highlight-related';
    }
    
    return '';
  };

  const getDifficultyName = (removals) => {
    if (removals <= 15) return "Tutorial";
    if (removals <= 20) return "Beginner";
    if (removals <= 25) return "Easy";
    if (removals <= 30) return "Casual";
    if (removals <= 35) return "Medium";
    if (removals <= 40) return "Challenging";
    if (removals <= 45) return "Hard";
    if (removals <= 50) return "Expert";
    if (removals <= 54) return "Master";
    if (removals <= 56) return "Grandmaster";
    return "Impossible";
  };

  const getDifficultyDescription = (removals) => {
    const descriptions = {
      15: "Perfect for learning the basics",
      20: "Get comfortable with the rules",
      25: "A gentle introduction",
      30: "Regular coffee break puzzle",
      35: "Requires some thinking",
      40: "You'll need your focus",
      45: "Real challenge ahead",
      50: "For the dedicated solver",
      54: "Test your expertise",
      56: "Only for the brave",
      58: "Beyond human limits"
    };
    // Find the closest difficulty level
    const levels = Object.keys(descriptions).map(Number);
    const closest = levels.reduce((prev, curr) => 
      Math.abs(curr - removals) < Math.abs(prev - removals) ? curr : prev
    );
    return descriptions[closest];
  };

  return (
    <div className="App" style={{ height: '100vh' }}>
      <Navbar
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
        onNewGame={handleNewGame}
        onAuthClick={() => setShowAuthDialog(true)}
        onSolve={handleSolve}    // Add this
        isSolved={isSolved}      // Add this
      />
      {puzzle ? (
        <div className="puzzle-container">
          <table className="puzzle">
            <tbody>
              {puzzle.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => {
                    const cellKey = `${rowIndex}-${cellIndex}`;
                    const marks = pencilMarks[cellKey] ? Array.from(pencilMarks[cellKey]).sort().join(' ') : '';
                    return (
                      <td
                        key={cellIndex}
                        className={getHighlightClass(rowIndex, cellIndex)}
                        style={{
                          width: '50px',
                          height: '50px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          fontSize: '24px',
                          borderTop: rowIndex % 3 === 0 ? '2px solid var(--grid-border-thick)' : '1px solid var(--grid-border)',
                          borderLeft: cellIndex % 3 === 0 ? '2px solid var(--grid-border-thick)' : '1px solid var(--grid-border)',
                          borderRight: (cellIndex + 1) % 3 === 0 ? '2px solid var(--grid-border-thick)' : '1px solid var(--grid-border)',
                          borderBottom: (rowIndex + 1) % 3 === 0 ? '2px solid var(--grid-border-thick)' : '1px solid var(--grid-border)',
                          padding: 0,
                          boxSizing: 'border-box',
                          position: 'relative',
                        }}
                      >
                        {originalPuzzle[rowIndex][cellIndex] !== 0 ? (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              lineHeight: '50px',
                              color: 'var(--text-color)',
                            }}
                            tabIndex={-1}
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, cellIndex)}
                            ref={(el) => (inputRefs.current[rowIndex * 9 + cellIndex] = el)}
                            onFocus={() => setFocusedCell([rowIndex, cellIndex])}
                            onBlur={() => setFocusedCell(null)}
                          >
                            {cell}
                          </div>
                        ) : (
                          <div
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, cellIndex)}
                            ref={(el) => (inputRefs.current[rowIndex * 9 + cellIndex] = el)}
                            style={{
                              width: '100%',
                              height: '100%',
                              lineHeight: '50px',
                              textAlign: 'center',
                              fontSize: '24px',
                              border: 'none',
                              outline: 'none',
                              padding: 0,
                              margin: 0,
                              boxSizing: 'border-box',
                              color: 'var(--input-color)',
                              cursor: 'default',
                            }}
                            className="puzzle-cell"
                            onFocus={() => setFocusedCell([rowIndex, cellIndex])}
                            onBlur={() => setFocusedCell(null)}
                          >
                            {cell !== 0 ? cell : ''}
                          </div>
                        )}
                        {marks && (
                          <div className="pencil-marks">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                              const hasNumber = Array.from(pencilMarks[cellKey]).includes(num);
                              return (
                                <div key={num} className="pencil-mark">
                                  {hasNumber ? num : ''}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading puzzle...</p>
      )}
      <div className="submit-button">
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Choose Difficulty</h2>
            <div className="slider-container">
              <label>
                <div className="difficulty-name">{getDifficultyName(removalsCount)}</div>
                <div className="difficulty-description">{getDifficultyDescription(removalsCount)}</div>
                <input
                  type="range"
                  min="12"
                  max="58"
                  value={removalsCount}
                  onChange={(e) => handleRemovalsChange(parseInt(e.target.value))}
                />
              </label>
            </div>
            <div className="preview-grid">
              {previewPuzzle && previewPuzzle.map((row, rowIndex) => (
                <div key={rowIndex} className="preview-row">
                  {row.map((cell, cellIndex) => (
                    <div key={cellIndex} className="preview-cell">
                      {cell || ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="dialog-buttons">
              <button onClick={() => setShowDialog(false)}>Cancel</button>
              <button onClick={handleDialogConfirm}>Start</button>
            </div>
          </div>
        </div>
      )}
      <AuthDialog 
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </div>
  );
}

export default App;