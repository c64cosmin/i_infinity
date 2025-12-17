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

        grid.solved = false;
        grid.solve(0,0);
    }
}

loadData();

