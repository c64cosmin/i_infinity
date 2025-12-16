import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Needed because we're using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend
app.use(express.static(path.join(__dirname, "../public")));

// Example API endpoint
app.get("/api/data", (_req, res) => {
  res.json({
    message: "Hello from the backend",
    timestamp: new Date().toISOString()
  });
});

// Serve the web view
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
