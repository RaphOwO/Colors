import { useState } from "react";
import { motion } from "framer-motion";
import "./../styles/login.css";

function Login({ onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const toggleMode = () => setIsLogin(!isLogin);
    
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
              <form>
                <input type="text" placeholder="Username" required />
                <input type="password" placeholder="Password" required />
                <button type="submit">Login</button>
              </form>
            ) : (
              <form>
                <input type="text" placeholder="Username" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
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