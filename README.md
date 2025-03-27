# Sudgen - Sudoku Generator & Solver

Sudgen is a Sudoku web app built with React on the frontend and FastAPI on the backend. It allows users to generate puzzles, solve them, track progress, and enjoy helpful features like pencil marks and keyboard support.

## Features

- Sudoku puzzle generation via a FastAPI backend
- Adjustable difficulty by setting number of removed cells
- Save/resume progress (localStorage and optional authentication)
- Dark mode toggle
- Pencil mode for marking candidates
- Fully keyboard-navigable interface

## Controls

- Enter numbers using keys `1–9`
- **Alternative input:** `QWEASDZXC` also work as numbers `1–9`  
- **Pencil marks:** Hold **Shift** while pressing `QWEASDZXC` to toggle pencil marks
- Use **Arrow Keys** to navigate
- Hold **Shift** while navigating to skip non-empty cells
- Press **Backspace** to erase a cell
- Press **Enter** to submit your solution

## Backend Endpoint

Hosted at:  
`https://sudgen.onrender.com/sudoku?removals=30`  
Adjust the `removals` parameter to control difficulty.

## Development

- **Frontend:** React (Vite)
- **Backend:** FastAPI
- **Frontend Deployment:** GitHub Pages  
- **Backend Deployment:** Render.com