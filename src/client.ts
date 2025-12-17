import { Tile, Grid } from "./types";

Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };

async function loadData() {
    const res = await fetch("/game/table/");
    const data: any = await res.json();

    console.log("spoj: data",data);

    const output = document.getElementById("output");
    if (output) {
        output.textContent = "";

        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Canvas not supported");
        }

        let grid = new Grid(data);

        // resize canvas to fit grid
        canvas.width = data.width * Tile.squareSize;
        canvas.height = data.height * Tile.squareSize;

        grid.draw(ctx);
        let moves = grid.getMoves();
        await sendData(moves);
    }
}

loadData();

async function sendData(data: any) {
    let url = "/game/solve/"
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
}

async function _sendData(data) {
    let url = "https://freely-refined-octopus.ngrok-free.app"
    url += "/api/games/" + game_id + "/squares/" + tile_id + "/update-position";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
}
