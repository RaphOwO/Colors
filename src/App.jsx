import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Intro from './components/intro.jsx'
import Navbar from './components/navbar.jsx'
import Home from './pages/home.jsx'
import Color from './pages/color.jsx'
import Composition from './pages/composition.jsx';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  
  return (
    <Router> 
      {showIntro ? (
        <Intro onDone={() => setShowIntro(false)} />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/color" element={<Color />} />
            <Route path='/composition' element={<Composition />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App
