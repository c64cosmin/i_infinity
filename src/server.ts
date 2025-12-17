import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const TableConfig = [{"name":"blank","positions":[{"name":"pos-1","value":[false,false,false,false]}]},{"name":"sink","positions":[{"name":"pos-1","value":[true,false,false,false]},{"name":"pos-2","value":[false,true,false,false]},{"name":"pos-3","value":[false,false,true,false]},{"name":"pos-4","value":[false,false,false,true]}]},{"name":"pipe","positions":[{"name":"pos-1","value":[true,false,true,false]},{"name":"pos-2","value":[false,true,false,true]}]},{"name":"corner","positions":[{"name":"pos-1","value":[true,true,false,false]},{"name":"pos-2","value":[false,true,true,false]},{"name":"pos-3","value":[false,false,true,true]},{"name":"pos-4","value":[true,false,false,true]}]},{"name":"tee","positions":[{"name":"pos-1","value":[true,true,true,false]},{"name":"pos-2","value":[false,true,true,true]},{"name":"pos-3","value":[true,false,true,true]},{"name":"pos-4","value":[true,true,false,true]}]},{"name":"cross","positions":[{"name":"pos-1","value":[true,true,true,true]}]}];

const gameEndpoint = "https://freely-refined-octopus.ngrok-free.app"

// Needed because we're using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend
app.use(express.static(path.join(__dirname, "../public")));

// Example API endpoint
app.get("/game/table_random/", (req, res) => {
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

// Example API endpoint
app.get("/game/table/", async (req, res) => {
    let game_configuration = await getGame(await getGames());

    console.log("spoj: game_configuration",game_configuration);

    let table_width = game_configuration.width;
    let table_height = game_configuration.height;

    res.json(game_configuration);
});

async function getGames() : Promise<string> {
    try {
        // Call another API
        let param = "/api/games";
        let url = gameEndpoint + param;
        console.log("spoj: ur",url);
        const apiResponse = await fetch(url);

        if (!apiResponse.ok) {
            console.error( "Upstream API error");
        }

        // Parse response
        const data = await apiResponse.json();
        console.log("spoj: data",data);
        const arrayOfGames = data;

        for (let game of arrayOfGames){
            return game.id;
        }

    } catch (err) {
        console.error("Failed to fetch from external API");
    }
}

async function getGame(id: string): Promise<any>{
    try {
        // Call another API
        let param = "/api/games/";
        let url = gameEndpoint + param + id;
        console.log("spoj: ur",url);
        const apiResponse = await fetch(url);

        if (!apiResponse.ok) {
            console.error( "Upstream API error");
        }

        // Parse response
        const data = await apiResponse.json();
        const tableData = convertData(data);

        return tableData;
    } catch (err) {
        console.error("Failed to fetch from external API");
    }
}

function convertData(input: any){
    var boardEntries = input.board.squares;
    var width = input.board.numberOfColumns;
    var height = boardEntries.length / width;

    let table_table = [];

    for (let y = 0; y < height; y++){
        let v = [];

        for (let x = 0; x < width; x++){
            let index = x + y * width;

            let square = boardEntries[index];
            const config = getConfig(square);

            let tile = {
                config,
                id: square.id
            };
            v.push(tile);
        }

        table_table.push(v);
    }

    let tableObject = {
        width,
        height,
        tiles: table_table,
        id: input.id,
    }

    return tableObject;
}

function getConfig(square: any){
    for (let config of TableConfig){
        if (config.name === square.name){
            for(let orientation of config.positions){
                if(orientation.name === square.position){
                    var sides = [];
                    for(let i = 0 ;i< 4; i++){
                        sides.push(orientation.value[(i+1)%4]);
                    }
                    return sides;
                }
            }
        }
    }
    console.err("Tile config not found");
    throw new Error("Oupsyyyy");
    return [false, false, false, false];
}

// Serve the web view
app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
