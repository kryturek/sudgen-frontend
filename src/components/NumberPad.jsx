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
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onNumberClick(num)}
          >
            {num}
          </button>
        ))}
        <button
          className="number-button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onNumberClick(0)}
        >
          Clear
        </button>
        <div className="number-pad-controls" style={{gridColumn: 'span 2'}}>
          <button
            className={`pencil-mode-toggle ${isPencilMode ? 'active' : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onPencilModeToggle}
          >
          ✎ Pencil Mode
        </button>
      </div>
      </div>
    </div>
  );
};

export default NumberPad;
