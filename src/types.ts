export class Grid {
    private x: number = 0;
    private y: number = 0;
    private tiles: Tile[][] = []

    constructor(data: any){
        this.x = data.width;
        this.y = data.height;

        for (let j = 0; j < this.y; j++){
            let v = []
            for (let i = 0; i < this.x; i++){
                let tile = data.tiles[j][i];
                let t = new Tile(i, j, tile.config);
                t.grid = this;
                v.push(t);
            }
            this.tiles.push(v)
        }
    }

    public getCell(pos_x: number, pos_y: number){
        if(pos_x < 0 || pos_x >= this.x || pos_y < 0 || pos_y >= this.y){
            return null;
        }
        return this.tiles[pos_y][pos_x];
    }

    public draw(ctx: CanvasRenderingContext2D){
        for (let j = 0; j < this.y; j++){
            for (let i = 0; i < this.x; i++){
                this.tiles[j][i].draw(ctx);
            }
        }
    }
    public moves: any[] = [];
    public solved = false;

    public solve(pos_x: number, pos_y: number){
        if(this.solved){
            return;
        }
        let cell = this.getCell(pos_x, pos_y);
        if(cell === null){
            return;
        }
        if(cell.visited){
            return;
        }

        for (let rot = 0; rot < 4; rot++){
            let move = {
                x: pos_x,
                y: pos_y,
                r: rot,
            };
            if(rot != 0){
                this.moves.push(move);
            }
            cell.rotation = rot;
            if(this.isSolved()){
                this.solved = true;
                console.log(...this.moves);
                return;
            }else{
                cell.visited = true;
                let o_x = [1, 0, -1, 0];
                let o_y = [0, 1, 0, -1];
                for (let i = 0; i < 4; i++){
                    let new_x = pos_x + o_x[i];
                    let new_y = pos_y + o_y[i];
                    this.solve(new_x, new_y);
                }
                cell.visited = false;
            }
            if(rot != 0){
                this.moves.pop();
            }
            cell.rotation = 0;
        }
    }

    private isSolved(): boolean{
        for (let j = 0; j < this.y; j++){
            for (let i = 0; i < this.x; i++){
                let tile = this.tiles[j][i];
                if(!tile.isConnected()){
                    return false;
                }
            }
        }
        return true;
    }
}

export class Tile {
    public static readonly squareSize: number = 64;
    public static readonly lineWidth: number = 7;
    public grid: Grid = null;
    public rotation: number = 0;
    public visited: boolean = false;
    //directions follow the cartesian coordinates
    //directions[0] mean the positive x axis
    //directions[1] mean the positive y axis
    //they all go clockwise as the xy coordinates on screen

    constructor(public x: number, public y: number, public directions: boolean[]){
    }

    public rotate(times: number){
        this.rotation = (this.rotation + times) % 4;
    }

    public draw(ctx: CanvasRenderingContext2D){
        if(!this.tileExists()){
            return;
        }
        ctx.fillStyle = this.getBgColor();
        const s = Tile.squareSize;
        ctx.fillRect(this.x * s, this.y * s, s, s);
        if(this.tileHorizontal()){
            this.drawHorizontal(ctx);
        }
        else if(this.tileVertical()){
            this.drawVertical(ctx);
        }
        else if(this.tileEnd()){
            this.drawEnd(ctx);
        }
        else{
            this.drawCorners(ctx);
        }
    }

    public getSide(index: number){
        return this.directions[(index-this.rotation + 4) % 4];
    }

    getBgColor(): string {
        const hue = ((this.x + this.y) % 2) * 15 + 220;
        return `hsl(${hue}, 70%, 80%)`;
    }

    isConnected(): boolean{
        const o_x = [1, 0,-1, 0];
        const o_y = [0, 1, 0,-1];
        for(let i = 0; i < 4; i++){
            if(this.directions[(i-this.rotation + 4) % 4]){
                let neighbor = this.grid.getCell(this.x + o_x[i], this.y + o_y[i]);
                if(neighbor){
                    if(!neighbor.getSide(i+2)){
                        return false;
                    }
                }else{
                    return false;
                }
            }
        }
        return true;
    }

    getColor(): string {
        return this.isConnected() ? "red" : "blue";
    }

    drawEnd(ctx: CanvasRenderingContext2D) {
        this.drawLine(ctx, (this.getTileEnd() - this.rotation + 4) % 4);
        this.drawCircle(ctx);
    }
    
    drawCorners(ctx: CanvasRenderingContext2D) {
        for (let n = 0; n < 4; n++){
            let i = (n - this.rotation + 4) % 4;
            let j = (i + 1) % 4;
            if(this.directions[i] && this.directions[j]){
                this.drawCorner(ctx, n);
            }
        }
    }

    drawCorner(ctx: CanvasRenderingContext2D, index: number) {
        const o_x = [1, 0, 0, 1];
        const o_y = [1, 1, 0, 0];
        const s = Tile.squareSize;
        const c_x = s * o_x[index] + this.x * s;
        const c_y = s * o_y[index] + this.y * s;
        const arc_s = (index + 2) * Math.PI / 2;
        const arc_e = (index + 3) * Math.PI / 2;
        ctx.beginPath();
        ctx.arc(c_x, c_y, s / 2, arc_s, arc_e);
        ctx.strokeStyle = this.getColor();
        ctx.lineWidth = Tile.lineWidth;
        ctx.stroke();
        ctx.closePath();
    }

    drawCircle(ctx: CanvasRenderingContext2D) {
        const s = Tile.squareSize;
        const pos_x = s * this.x;
        const pos_y = s * this.y;
        const c_x = pos_x + s / 2;
        const c_y = pos_y + s / 2;
        ctx.beginPath();
        ctx.arc(c_x, c_y, s * 0.3, 0, Math.PI * 2); // full circle
        ctx.fillStyle = this.getColor();
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(c_x, c_y, s * 0.3 - Tile.lineWidth, 0, Math.PI * 2); // full circle
        ctx.fillStyle = this.getBgColor();
        ctx.fill();
        ctx.closePath();
    }

    drawLine(ctx: CanvasRenderingContext2D, index: number) {
        const o_x = [1, 0,-1, 0];
        const o_y = [0, 1, 0,-1];
        const s = Tile.squareSize;
        const pos_x = s * this.x;
        const pos_y = s * this.y;
        const c_x = pos_x + s / 2;
        const c_y = pos_y + s / 2;
        ctx.beginPath();
        ctx.moveTo(c_x, c_y);
        ctx.lineTo(c_x + o_x[index] * s/2, c_y + o_y[index] * s/2);
        ctx.strokeStyle = this.getColor();
        ctx.lineWidth = Tile.lineWidth;
        ctx.stroke();
        ctx.closePath();
    }

    private drawHorizontal(ctx: CanvasRenderingContext2D){
        const s = Tile.squareSize;
        const pos_x = s * this.x;
        const pos_y = s * this.y;
        const c_x = pos_x + s / 2;
        const c_y = pos_y + s / 2;
        ctx.beginPath();
        ctx.moveTo(c_x - s/2, c_y);
        ctx.lineTo(c_x + s/2, c_y);
        ctx.strokeStyle = this.getColor();
        ctx.lineWidth = Tile.lineWidth;
        ctx.stroke();
        ctx.closePath();
    }

    private drawVertical(ctx: CanvasRenderingContext2D){
        const s = Tile.squareSize;
        const pos_x = s * this.x;
        const pos_y = s * this.y;
        const c_x = pos_x + s / 2;
        const c_y = pos_y + s / 2;
        ctx.beginPath();
        ctx.moveTo(c_x, c_y - s/2);
        ctx.lineTo(c_x, c_y + s/2);
        ctx.strokeStyle = this.getColor();
        ctx.lineWidth = Tile.lineWidth;
        ctx.stroke();
        ctx.closePath();
    }

    private tileExists(): boolean{
        return this.directions[0] || this.directions[1] || this.directions[2] || this.directions[3];
    }

    private tileEnd(): boolean{
        let count = 0;
        for (let i = 0; i < 4; i++){
            if(this.directions[i]){
                count += 1;
                if(count >= 2){
                    return false;
                }
            }
        }
        return true;
    }

    private getTileEnd(): number{
        for (let i = 0; i < 4; i++){
            if(this.directions[i]){
                return i;
            }
        }
        return -1;
    }

    private tileHorizontal(): boolean{
        var o = [true, false, true, false];
        for(let i = 0; i < 4; i++){
            if((this.directions[(i-this.rotation + 4) % 4] ^ o[i])){
                return false;
            }
        }
        return true;
    }

    private tileVertical(): boolean{
        var o = [false, true, false, true];
        for(let i = 0; i < 4; i++){
            if((this.directions[(i-this.rotation + 4) % 4] ^ o[i])){
                return false;
            }
        }
        return true;
    }
};

