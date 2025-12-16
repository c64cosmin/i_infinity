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
app.get("/game/table/:game_id", (req, res) => {
    let game_id = req.params.game_id;

    let table_width = 10;
    let table_height = 10;
    let table_table = [];

    for (let y = 0; y < table_height; y++){
        let v = [];

        for (let x = 0; x < table_width; x++){
            let n = (Math.random() < 0.5);
            let s = (Math.random() < 0.5);
            let w = (Math.random() < 0.5);
            let e = (Math.random() < 0.5);
            v.push([e, s, w, n]);
        }

        table_table.push(v);
    }
    res.json({
        width: table_width,
        height: table_height,
        tiles: table_table,
    });
});

// Serve the web view
app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
