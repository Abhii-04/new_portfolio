const express = require("express");
const session = require("express-session");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const frontendRoot = path.join(__dirname, "../frontend");
const app = express();
app.set("views", path.join(frontendRoot, "templates"));


app.use(cookieParser());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const sessionSecret = process.env.SESSION_SECRET_KEY || "dev-session-secret";

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Middleware
app.use(express.static(frontendRoot));

// Import routes
const pageRoutes = require("./Routes/pageroutes.js");
app.use("/", pageRoutes);

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
