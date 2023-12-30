import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from './pages/Home';
import { Level1 } from './pages/Level1';
import { Level2 } from './pages/Level2';
import { Level3 } from './pages/Level3';
import { Constructor } from './pages/Constructor';

import './styles.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/protein-folding' element={<Home />} />
          <Route path='/protein-folding/level-1' element={<Level1 />} />
          <Route path='/protein-folding/level-2' element={<Level2 />} />
          <Route path='/protein-folding/level-3' element={<Level3 />} />
          <Route path='/protein-folding/constructor' element={<Constructor />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

// TODO:
// - Configure Level2 and Level3 settings

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
