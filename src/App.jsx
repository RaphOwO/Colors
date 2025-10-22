import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import './App.css';
import Intro from './components/intro.jsx';
import Navbar from './components/navbar.jsx';
import Home from './pages/home.jsx';
import Color from './pages/color.jsx';
import Composition from './pages/composition.jsx';
import Login from './components/login.jsx';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router> 
      {showIntro ? (
        <Intro onDone={() => setShowIntro(false)} />
      ) : (
        <>
          <Navbar onLoginClick={() => setShowLogin(true)} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/color" element={<Color />} />
            <Route path='/composition' element={<Composition />} />
          </Routes>
          <AnimatePresence mode='wait'>
            {showLogin && <Login onClose={() => setShowLogin(false)} />}
          </AnimatePresence>
        </>
      )}
    </Router>
  );
}

export default App;
