import { ctx } from "./blockArt";

export class Block {
    private x = 0;
    private y = 0;

    private _color = "";
    private _size = 10;

    constructor(x: number, y: number, size: number, color: string) {
        this.x = x;
        this.y = y;

        this._size = size;
        this._color = color

        requestAnimationFrame(() => this.draw());
    }

    get color() {
        return this._color;
    }
    set color(color) {
        this._color = color;
        requestAnimationFrame(() => this.draw());
    }
    get size() {
        return this._size;
    }
    set size(size) {
        this._size = size;
        requestAnimationFrame(() => this.draw());
    }

    get pos() {
        return { x: this.x, y: this.y };
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
};

export default Block;