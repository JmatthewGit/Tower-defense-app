import React, { useState, useEffect } from "react";
import PF from "pathfinding";
import "./Grid.css";

const Grid = ({ rows, cols }) => {
  const [grid, setGrid] = useState(new PF.Grid(cols, rows));
  const [obstacles, setObstacles] = useState([]);
  const [enemyPath, setEnemyPath] = useState([]);
  const [enemyPosition, setEnemyPosition] = useState([0, 0]); // Starting position at (0, 0)

  useEffect(() => {
    // Recalculate path when obstacles change
    findPath(grid);
  }, [obstacles]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (enemyPath.length > 0) {
        moveEnemy();
      }
    }, 500); // Moves every 500ms
    return () => clearInterval(interval);
  }, [enemyPath]);

  const findPath = (grid) => {
    const finder = new PF.AStarFinder();
    const path = finder.findPath(
      enemyPosition[0],
      enemyPosition[1],
      cols - 1,
      rows - 1,
      grid.clone()
    );
    setEnemyPath(path);
  };

  const moveEnemy = () => {
    if (enemyPath.length > 1) {
      const nextPosition = enemyPath[1]; // Get the next step in the path
      setEnemyPosition([nextPosition[0], nextPosition[1]]);
      setEnemyPath(enemyPath.slice(1)); // Remove the first step
    }
  };

  const placeObstacle = (row, col, isRightClick = false) => {
    setGrid((prevGrid) => {
      const newGrid = new PF.Grid(cols, rows);
      const newObstacles = [...obstacles];

      if (isRightClick) {
        // Remove obstacle
        const index = newObstacles.findIndex(
          ([r, c]) => r === row && c === col
        );
        if (index > -1) newObstacles.splice(index, 1);
      } else {
        // Add obstacle
        if (!newObstacles.some(([r, c]) => r === row && c === col)) {
          newObstacles.push([row, col]);
        }
      }

      setObstacles(newObstacles);

      // Update the grid with obstacles
      newObstacles.forEach(([obstRow, obstCol]) => {
        newGrid.setWalkableAt(obstCol, obstRow, false);
      });

      return newGrid;
    });
  };

  const handleRightClick = (event, row, col) => {
    event.preventDefault(); // Prevent context menu from appearing
    placeObstacle(row, col, true); // Remove obstacle
  };

  return (
    <div className="grid">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="row">
          {Array.from({ length: cols }).map((_, colIndex) => {
            const isEnemy =
              enemyPosition[1] === rowIndex && enemyPosition[0] === colIndex;
            const isObstacle = obstacles.some(
              ([row, col]) => row === rowIndex && col === colIndex
            );

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${isEnemy ? "enemy" : ""} ${
                  isObstacle ? "obstacle" : ""
                }`}
                onClick={() => placeObstacle(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)} // Right-click event
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
