const fetchPuzzle = async (removals) => {
  try {
    const response = await fetch(`http://localhost:8000/sudoku?removals=${removals}`);
    const data = await response.json();
    return data.puzzle;
  } catch (error) {
    console.error('Error fetching puzzle:', error);
    return null;
  }
};

const difficultyLevels = {
  tutorial: 10,
  beginner: 18,
  easy: 24,
  casual: 30,
  medium: 35,
  challenging: 40,
  hard: 45,
  expert: 50,
  master: 54,
  grandmaster: 56,
  impossible: 60
};

const generateMocks = async () => {
  const mocks = {};
  
  for (const [level, removals] of Object.entries(difficultyLevels)) {
    console.log(`Fetching ${level} puzzle with ${removals} removals...`);
    mocks[level] = await fetchPuzzle(removals);
  }

  console.log('Generated mock puzzles:');
  console.log(JSON.stringify(mocks, null, 2));
};

// Run this in browser console or Node.js environment
generateMocks();
