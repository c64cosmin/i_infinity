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
const squareSize = 40;
const rows = 10;
const cols = 10;

// resize canvas to fit grid
canvas.width = cols * squareSize;
canvas.height = rows * squareSize;

// simple color generator
function getColor(row: number, col: number): string {
  const hue = (row * cols + col) * 15;
  return `hsl(${hue}, 70%, 55%)`;
}

// draw grid
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    ctx.fillStyle = getColor(row, col);
    ctx.fillRect(
      col * squareSize,
      row * squareSize,
      squareSize,
      squareSize
    );
  }
}
