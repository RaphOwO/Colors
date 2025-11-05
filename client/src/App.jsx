import { useState, useEffect } from 'react';
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          setUser(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () =>{
    console.log(user)
    localStorage.removeItem("token")
    setUser(null)
    console.log(user)
  }

  return (
    <Router> 
      {showIntro ? (
        <Intro onDone={() => setShowIntro(false)} />
      ) : (
        <>
          <Navbar onLoginClick={() => setShowLogin(true)} onLogOutClick={handleLogout} user={user} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/color" element={<Color />} />
            <Route path='/composition' element={<Composition />} />
          </Routes>
          <AnimatePresence mode='wait'>
            {showLogin && <Login onClose={() => setShowLogin(false)} setUser={setUser} />}
          </AnimatePresence>
        </>
      )}
    </Router>
  );
}

export default App;
