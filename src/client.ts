import { Grid } from "./types";

Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };

type ApiResponse = {
  message: string;
  timestamp: string;
};

async function loadData() {
  const res = await fetch("/api/data");
  const data: ApiResponse = await res.json();

  const output = document.getElementById("output");
  if (output) {
    output.textContent = JSON.stringify(data, null, 2);
  }
}

loadData();

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Canvas not supported");
}

// configurable
const squareSize = 100;
const rows = 10;
const cols = 10;

let grid = new Grid(cols, rows);

// resize canvas to fit grid
canvas.width = cols * squareSize;
canvas.height = rows * squareSize;

grid.draw(ctx);
