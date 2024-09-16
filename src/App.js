// src/App.js
import React from "react";
import Grid from "./Grid"; // Correct relative import inside src
import "./App.css"; // Ensure you have this CSS file if needed

const App = () => {
  const rows = 20; // Number of rows
  const cols = 50; // Number of columns

  return (
    <div className="App">
      <h1>Tower Defense Game</h1>
      <Grid rows={rows} cols={cols} />
    </div>
  );
};

export default App;
