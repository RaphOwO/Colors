import { useState } from "react";
import { motion } from "framer-motion";
import "./../styles/login.css";

function Login({ onClose , setUser}) {
    const [isLogin, setIsLogin] = useState(true);
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [username,setUsername] = useState("");
    const [error, setError] = useState("");    
    const toggleMode = () => {
      setIsLogin(!isLogin);
      setError("")
    }

    const HandleRegister = async(e) => {
      e.preventDefault();
      setError("");
      try {
        const res = await fetch("http://localhost:8000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
  
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Registration failed");
          return;
        }
        setIsLogin(true);
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      }
    };

    const HandleLogin = async (e) =>{
      e.preventDefault();
      setError("");
  
      try {
        const res = await fetch("http://localhost:8000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
  
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Login failed");
          return;
        }
  
        const data = await res.json();
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        setUser(data.user)
        onClose();
      } catch (err) {
        console.error("Login error:", err);
        setError("Something went wrong. Please try again.");
      }
    }

    return (
      <motion.div
        className="login-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <motion.div
          className="login-box"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()}
          layout
        >
          <h2 className="modal-title">{isLogin ? "Login" : "Sign Up"}</h2>
    
          <motion.div layout>
            {isLogin ? (
              <form onSubmit={HandleLogin}>
                <input type="text" placeholder="Username" onChange={(e)=>setUsername(e.target.value)} value={username}required />
                <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} value={password} required />
                {error && <p className="error-text">{error}</p>}
                <button type="submit">Login</button>
              </form>
            ) : (
                <form onSubmit={HandleRegister}>
                  <input type="text" placeholder="Username" onChange={(e)=>setUsername(e.target.value)} value={username} required />
                  <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                  <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} value={password} required />
                  {error && <p className="error-text">{error}</p>}
                  <button type="submit">Create Account</button>
                </form>
            )}
          </motion.div>
    
          <p className="switch-text">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <span className="switch-link" onClick={toggleMode}>
              {isLogin ? "Sign up" : "Login"}
            </span>
          </p>
        </motion.div>
      </motion.div>
    );
}

export default Login;