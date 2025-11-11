import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import './App.css';
import Intro from './components/intro.jsx';
import Navbar from './components/navbar.jsx';
import Home from './pages/home.jsx';
import ColorTheory from './pages/colorTheory.jsx';
import Meaning from './pages/colorMeaning.jsx';
import Composition from './pages/composition.jsx';
import Login from './components/login.jsx';
import TestPage from './pages/test.jsx';
import { getCurrentUser } from "./utils/auth";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const data = await getCurrentUser();
      setUser(data);
    }
    fetchUser();
  }, []);

  const handleLogout = () =>{
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <Router>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onLogOutClick={handleLogout}
        user={user}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/color/theory" element={<ColorTheory />} />
        <Route path="/color/meaning" element={<Meaning/>}/>
        <Route path="/composition" element={<Composition />} />
        <Route path="/test" element={<TestPage user={user} />} />

      </Routes>

      <AnimatePresence>
        {showIntro && <Intro onDone={() => setShowIntro(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showLogin && (
          <Login onClose={() => setShowLogin(false)} setUser={setUser} />
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;
