import React from 'react';

const NumberPad = ({ onNumberClick, isPencilMode, onPencilModeToggle }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="number-pad">
      <div className="number-pad-grid">
        {numbers.map(num => (
          <button
            key={num}
            className="number-button"
            onClick={() => onNumberClick(num)}
          >
            {num}
          </button>
        ))}
        <button className="number-button" onClick={() => onNumberClick(0)}>
          Clear
        </button>
      </div>
      <div className="number-pad-controls">
        <button
          className={`pencil-mode-toggle ${isPencilMode ? 'active' : ''}`}
          onClick={onPencilModeToggle}
        >
          ✎ Pencil Mode
        </button>
      </div>
    </div>
  );
};

export default NumberPad;
