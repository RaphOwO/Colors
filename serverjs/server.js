const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sqlite3 = require("sqlite3").verbose();

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const db = new sqlite3.Database("./userdata.db", (err) => {
  if (err) {
    console.error("❌ Error opening database:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT
    )
`);

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "Access denied, no token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

app.get("/", (req, res) => {
  res.send("Hello from Node.js backend!");
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    db.get(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email],
      async (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database error" });
        }

        if (row) {
          if (row.username === username) {
            return res.status(400).json({ error: "Username already exists" });
          }
          if (row.email === email) {
            return res.status(400).json({ error: "Email already registered" });
          }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          (err) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ error: "Failed to create account" });
            }
            res.status(201).json({ message: "Account created successfully" });
          }
        );
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(400).json({ error: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign(
          { username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ message: "Login successful", token , user});
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/register/users", (req, res) => {
  db.all("SELECT id, username, email FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

app.get("/user", authenticateToken, (req, res) => {
  const username = req.user.username;

  db.get(
    "SELECT id, username, email FROM users WHERE username = ?",
    [username],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!row) return res.status(404).json({ error: "User not found" });

      res.json(row);
    }
  );
});

app.listen(8000, () => console.log("Server running on http://localhost:8000"));
