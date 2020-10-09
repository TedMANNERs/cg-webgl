import {Rectangle} from "./Rectangle.js";

class Ball extends Rectangle{
    constructor(gl, ctx, x, y, height, width, color, speed) {
        super(gl, ctx, x, y, height, width, color);
        this.step_movement_x = speed;
        this.step_movement_y = speed;
    }
}

export { Ball };