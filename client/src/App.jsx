import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import Intro from './components/intro.jsx';
import Navbar from './components/navbar.jsx';
import Home from './pages/home.jsx';
import ColorTheory from './pages/colorTheory.jsx';
import Meaning from './pages/colorMeaning.jsx';
import Composition from './pages/composition.jsx';
import Login from './components/login.jsx';
import { getCurrentUser } from "./utils/auth";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]); 
  
  return null;
}

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

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
    <>
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onLogOutClick={handleLogout}
        user={user}
      />
      <ScrollToTop/>
      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/color/theory" element={<ColorTheory />} />
          <Route path="/color/meaning" element={<Meaning/>}/>
          <Route path="/composition" element={<Composition />} />
        </Routes>
      </AnimatePresence>

      <AnimatePresence>
        {showIntro && <Intro onDone={() => setShowIntro(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showLogin && (
          <Login onClose={() => setShowLogin(false)} setUser={setUser} />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
