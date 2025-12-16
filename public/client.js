// src/types.ts
var Grid = class {
  constructor(data) {
    this.x = 0;
    this.y = 0;
    this.tiles = [];
    this.x = data.width;
    this.y = data.height;
    for (let j = 0; j < this.y; j++) {
      let v = [];
      for (let i = 0; i < this.x; i++) {
        let t = new Tile(i, j, data.tiles[i][j]);
        t.grid = this;
        v.push(t);
      }
      this.tiles.push(v);
    }
  }
  getCell(pos_x, pos_y) {
    if (pos_x < 0 || pos_x >= this.x || pos_y < 0 || pos_y >= this.y) {
      return null;
    }
    return this.tiles[pos_y][pos_x];
  }
  draw(ctx) {
    for (let j = 0; j < this.y; j++) {
      for (let i = 0; i < this.x; i++) {
        this.tiles[i][j].draw(ctx);
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
    this.grid = null;
    this.rotation = 0;
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
  draw(ctx) {
    if (!this.tileExists()) {
      return;
    }
    ctx.fillStyle = this.getBgColor();
    const s = _Tile.squareSize;
    ctx.fillRect(this.x * s, this.y * s, s, s);
    if (this.tileHorizontal()) {
      this.drawHorizontal(ctx);
    } else if (this.tileVertical()) {
      this.drawVertical(ctx);
    } else if (this.tileEnd()) {
      this.drawEnd(ctx);
    } else {
      this.drawCorners(ctx);
    }
  }
  getSide(index) {
    return this.directions[(index - this.rotation + 4) % 4];
  }
  getBgColor() {
    const hue = (this.x + this.y) % 2 * 15 + 220;
    return `hsl(${hue}, 70%, 80%)`;
  }
  isConnected() {
    const o_x = [1, 0, -1, 0];
    const o_y = [0, 1, 0, -1];
    for (let i = 0; i < 4; i++) {
      if (this.directions[(i - this.rotation + 4) % 4]) {
        let neighbor = this.grid.getCell(this.x + o_x[i], this.y + o_y[i]);
        if (neighbor) {
          if (!neighbor.getSide(i + 2)) {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    return true;
  }
  getColor() {
    return this.isConnected() ? "red" : "blue";
  }
  drawEnd(ctx) {
    this.drawLine(ctx, (this.getTileEnd() - this.rotation + 4) % 4);
    this.drawCircle(ctx);
  }
  drawCorners(ctx) {
    for (let n = 0; n < 4; n++) {
      let i = (n - this.rotation + 4) % 4;
      let j = (i + 1) % 4;
      if (this.directions[i] && this.directions[j]) {
        this.drawCorner(ctx, n);
      }
    }
  }
  drawCorner(ctx, index) {
    const o_x = [1, 0, 0, 1];
    const o_y = [1, 1, 0, 0];
    const s = _Tile.squareSize;
    const c_x = s * o_x[index] + this.x * s;
    const c_y = s * o_y[index] + this.y * s;
    const arc_s = (index + 2) * Math.PI / 2;
    const arc_e = (index + 3) * Math.PI / 2;
    ctx.beginPath();
    ctx.arc(c_x, c_y, s / 2, arc_s, arc_e);
    ctx.strokeStyle = this.getColor();
    ctx.lineWidth = _Tile.lineWidth;
    ctx.stroke();
    ctx.closePath();
  }
  drawCircle(ctx) {
    const s = _Tile.squareSize;
    const pos_x = s * this.x;
    const pos_y = s * this.y;
    const c_x = pos_x + s / 2;
    const c_y = pos_y + s / 2;
    ctx.beginPath();
    ctx.arc(c_x, c_y, s * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = this.getColor();
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(c_x, c_y, s * 0.3 - _Tile.lineWidth, 0, Math.PI * 2);
    ctx.fillStyle = this.getBgColor();
    ctx.fill();
    ctx.closePath();
  }
  drawLine(ctx, index) {
    const o_x = [1, 0, -1, 0];
    const o_y = [0, 1, 0, -1];
    const s = _Tile.squareSize;
    const pos_x = s * this.x;
    const pos_y = s * this.y;
    const c_x = pos_x + s / 2;
    const c_y = pos_y + s / 2;
    ctx.beginPath();
    ctx.moveTo(c_x, c_y);
    ctx.lineTo(c_x + o_x[index] * s / 2, c_y + o_y[index] * s / 2);
    ctx.strokeStyle = this.getColor();
    ctx.lineWidth = _Tile.lineWidth;
    ctx.stroke();
    ctx.closePath();
  }
  drawHorizontal(ctx) {
    const s = _Tile.squareSize;
    const pos_x = s * this.x;
    const pos_y = s * this.y;
    const c_x = pos_x + s / 2;
    const c_y = pos_y + s / 2;
    ctx.beginPath();
    ctx.moveTo(c_x - s / 2, c_y);
    ctx.lineTo(c_x + s / 2, c_y);
    ctx.strokeStyle = this.getColor();
    ctx.lineWidth = _Tile.lineWidth;
    ctx.stroke();
    ctx.closePath();
  }
  drawVertical(ctx) {
    const s = _Tile.squareSize;
    const pos_x = s * this.x;
    const pos_y = s * this.y;
    const c_x = pos_x + s / 2;
    const c_y = pos_y + s / 2;
    ctx.beginPath();
    ctx.moveTo(c_x, c_y - s / 2);
    ctx.lineTo(c_x, c_y + s / 2);
    ctx.strokeStyle = this.getColor();
    ctx.lineWidth = _Tile.lineWidth;
    ctx.stroke();
    ctx.closePath();
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
  const res = await fetch("/game/table/5");
  const data = await res.json();
  const output = document.getElementById("output");
  if (output) {
    output.textContent = "";
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas not supported");
    }
    let grid = new Grid(data);
    canvas.width = data.width * Tile.squareSize;
    canvas.height = data.height * Tile.squareSize;
    grid.draw(ctx);
  }
}
loadData();
