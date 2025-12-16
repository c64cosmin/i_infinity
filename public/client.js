// src/types.ts
var Grid = class {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tiles = [];
    for (let j = 0; j < y; j++) {
      let v = [];
      for (let i = 0; i < x; i++) {
        let n = Math.random() < 0.5;
        let s = Math.random() < 0.5;
        let w = Math.random() < 0.5;
        let e = Math.random() < 0.5;
        v.push(new Tile(i, j, [e, s, w, n]));
      }
      this.tiles.push(v);
    }
  }
  draw(ctx2) {
    for (let j = 0; j < this.y; j++) {
      for (let i = 0; i < this.x; i++) {
        this.tiles[i][j].draw(ctx2);
      }
    }
  }
};
var Tile = class _Tile {
  //directions follow the cartesian coordinates
  //directions[0] mean the positive x axis
  //directions[1] mean the positive y axis
  //they all go clockwise as the xy coordinates on screen
  constructor(x, y, directions) {
    this.x = x;
    this.y = y;
    this.directions = directions;
    this.rotation = 0;
    this.rotation = 1;
  }
  static {
    this.squareSize = 64;
  }
  static {
    this.lineWidth = 7;
  }
  rotate(times) {
    this.rotation = (this.rotation + times) % 4;
  }
  draw(ctx2) {
    if (!this.tileExists()) {
      return;
    }
    ctx2.fillStyle = this.getColor();
    const s = _Tile.squareSize;
    ctx2.fillRect(this.x * s, this.y * s, s, s);
    if (this.tileHorizontal()) {
      this.drawHorizontal(ctx2);
    } else if (this.tileVertical()) {
      this.drawVertical(ctx2);
    } else if (this.tileEnd()) {
      this.drawEnd(ctx2);
    } else {
      this.drawCorners(ctx2);
    }
  }
  getColor() {
    const hue = (this.x + this.y) % 2 * 15 + 220;
    return `hsl(${hue}, 70%, 80%)`;
  }
  drawEnd(ctx2) {
    this.drawLine(ctx2, (this.getTileEnd() - this.rotation + 4) % 4);
    this.drawCircle(ctx2);
  }
  drawCorners(ctx2) {
    for (let n = 0; n < 4; n++) {
      let i = (n - this.rotation + 4) % 4;
      let j = (i + 1) % 4;
      if (this.directions[i] && this.directions[j]) {
        this.drawCorner(ctx2, n);
      }
    }
  }
  drawCorner(ctx2, index) {
    const o_x = [1, 0, 0, 1];
    const o_y = [1, 1, 0, 0];
    const s = _Tile.squareSize;
    const c_x = s * o_x[index] + this.x * s;
    const c_y = s * o_y[index] + this.y * s;
    const arc_s = (index + 2) * Math.PI / 2;
    const arc_e = (index + 3) * Math.PI / 2;
    ctx2.beginPath();
    ctx2.arc(c_x, c_y, s / 2, arc_s, arc_e);
    ctx2.strokeStyle = "blue";
    ctx2.lineWidth = _Tile.lineWidth;
    ctx2.stroke();
    ctx2.closePath();
  }
  drawCircle(ctx2) {
    const s = _Tile.squareSize;
    const pos_x = s * this.x;
    const pos_y = s * this.y;
    const c_x = pos_x + s / 2;
    const c_y = pos_y + s / 2;
    ctx2.beginPath();
    ctx2.arc(c_x, c_y, s * 0.3, 0, Math.PI * 2);
    ctx2.fillStyle = "blue";
    ctx2.fill();
    ctx2.closePath();
    ctx2.beginPath();
    ctx2.arc(c_x, c_y, s * 0.3 - _Tile.lineWidth, 0, Math.PI * 2);
    ctx2.fillStyle = "white";
    ctx2.fill();
    ctx2.closePath();
  }
  drawLine(ctx2, index) {
    const o_x = [1, 0, -1, 0];
    const o_y = [0, 1, 0, -1];
    const s = _Tile.squareSize;
    const pos_x = s * this.x;
    const pos_y = s * this.y;
    const c_x = pos_x + s / 2;
    const c_y = pos_y + s / 2;
    ctx2.beginPath();
    ctx2.moveTo(c_x, c_y);
    ctx2.lineTo(c_x + o_x[index] * s / 2, c_y + o_y[index] * s / 2);
    ctx2.strokeStyle = "blue";
    ctx2.lineWidth = _Tile.lineWidth;
    ctx2.stroke();
    ctx2.closePath();
  }
  drawHorizontal(ctx2) {
    const s = _Tile.squareSize;
    const pos_x = s * this.x;
    const pos_y = s * this.y;
    const c_x = pos_x + s / 2;
    const c_y = pos_y + s / 2;
    ctx2.beginPath();
    ctx2.moveTo(c_x - s / 2, c_y);
    ctx2.lineTo(c_x + s / 2, c_y);
    ctx2.strokeStyle = "blue";
    ctx2.lineWidth = _Tile.lineWidth;
    ctx2.stroke();
    ctx2.closePath();
  }
  drawVertical(ctx2) {
    const s = _Tile.squareSize;
    const pos_x = s * this.x;
    const pos_y = s * this.y;
    const c_x = pos_x + s / 2;
    const c_y = pos_y + s / 2;
    ctx2.beginPath();
    ctx2.moveTo(c_x, c_y - s / 2);
    ctx2.lineTo(c_x, c_y + s / 2);
    ctx2.strokeStyle = "blue";
    ctx2.lineWidth = _Tile.lineWidth;
    ctx2.stroke();
    ctx2.closePath();
  }
  tileExists() {
    return this.directions[0] || this.directions[1] || this.directions[2] || this.directions[3];
  }
  tileEnd() {
    let count = 0;
    for (let i = 0; i < 4; i++) {
      if (this.directions[i]) {
        count += 1;
        if (count >= 2) {
          return false;
        }
      }
    }
    return true;
  }
  getTileEnd() {
    for (let i = 0; i < 4; i++) {
      if (this.directions[i]) {
        return i;
      }
    }
    return -1;
  }
  tileHorizontal() {
    var o = [true, false, true, false];
    for (let i = 0; i < 4; i++) {
      if (this.directions[(i - this.rotation + 4) % 4] ^ o[i]) {
        return false;
      }
    }
    return true;
  }
  tileVertical() {
    var o = [false, true, false, true];
    for (let i = 0; i < 4; i++) {
      if (this.directions[(i - this.rotation + 4) % 4] ^ o[i]) {
        return false;
      }
    }
    return true;
  }
};

// src/client.ts
Math.fmod = function(a, b) {
  return Number((a - Math.floor(a / b) * b).toPrecision(8));
};
async function loadData() {
  const res = await fetch("/api/data");
  const data = await res.json();
  const output = document.getElementById("output");
  if (output) {
    output.textContent = JSON.stringify(data, null, 2);
  }
}
loadData();
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Canvas not supported");
}
var squareSize = 100;
var rows = 10;
var cols = 10;
var grid = new Grid(cols, rows);
canvas.width = cols * squareSize;
canvas.height = rows * squareSize;
grid.draw(ctx);
