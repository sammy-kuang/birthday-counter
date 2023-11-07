import React from 'react';
import './App.css';
import { Button } from '@mui/material';
import { BirthdayCard } from './components/BirthdayCard';
import { CardList } from './components/CardList';

function App() {
  return (
    <div className="App">
      <CardList />
    </div>
  );
}

export default App;
