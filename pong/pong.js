//
// Computer Graphics
//
// WebGL Exercises
//
import * as Color from "../color.js"
import {Rectangle} from "./Rectangle.js"
import {Ball} from "./Ball.js";

// Register function to call after document has loaded
window.onload = startup;

// global variables
let gl; // the gl object is saved globally
let lastUpdateTime; // timestamp of the last call of drawAnimated(..)

// we keep all local parameters for the program in a single object
let ctx = {
    shaderProgram: -1, //wird unten wieder überschrieben
    aVertexPositionId: -1,
    aVertexColorId: -1,
    uProjectionMatId: -1,
    uModelMatId: -1
};

// names of the objects we want to draw
const DIVIDER = "divider"
const BALL = "ball"
const LEFT_PADDLE = "left_paddle"
const RIGHT_PADDLE = "RIGHT_paddle"

const PADDLE_SPEED = 10

// dictionary with all the objects we want to draw.
const shapeObjects = {};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
    window.requestAnimationFrame(drawAnimated);// Register function to call before the next redraw
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();

    // set the clear color here
    gl.clearColor(.1,.1,.1,1); //-> damit wird alles übermalen (erst wenn clear)
    
    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    // finds the index of the variable in the program || überschreibt ctx.aVertexPositionId
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict"
    shapeObjects[BALL] = new Ball(gl, ctx, 0, 0, 20, 20, Color.WHITE, 0.3);
    shapeObjects[DIVIDER] = new Rectangle(gl, ctx, 0, 0, 600, 3, Color.WHITE);
    shapeObjects[LEFT_PADDLE] = new Rectangle(gl, ctx, -370, 0, 80, 20, Color.WHITE);
    shapeObjects[RIGHT_PADDLE] = new Rectangle(gl, ctx, 370, 0, 80, 20, Color.WHITE);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set up the world coordinates
    let projectionMat = mat3.create();
    mat3.fromScaling(projectionMat, vec2.fromValues(2.0/gl.drawingBufferWidth, 2.0/gl.drawingBufferHeight));
    gl.uniformMatrix3fv(ctx.uProjectionMatId , false , projectionMat);

    // add drawing routines here
    for (const [key, shape] of Object.entries(shapeObjects)) {
        shape.draw()
    }
    console.log("done");
}

/**
 * Update and redraw scene every frame
 * @param timestamp
 */
function drawAnimated(timestamp) {
    // calculate time since last call
    if (lastUpdateTime === undefined)
        lastUpdateTime = timestamp;
    const elapsed = timestamp - lastUpdateTime;
    lastUpdateTime = timestamp;

    // move or change objects
    UpdateBallPosition(elapsed);
    MoveLeftPaddle(elapsed);
    MoveRightPaddle(elapsed);

    // draw
    draw();

    let ball = shapeObjects[BALL];
    if (ball.x <= -390) {
        alert("Right Player won!")
        return
    }
    if (ball.x >= 390) {
        alert("Left Player won!")
        return
    }

    // request the next frame
    window.requestAnimationFrame(drawAnimated);
}

function MoveRightPaddle(elapsed_time) {
    let paddle = shapeObjects[RIGHT_PADDLE];
    const max_top = 300 - paddle.height / 2;
    if (isDown(key.UP)) {
        paddle.y < max_top ? paddle.y += PADDLE_SPEED : paddle.y = max_top;
    }

    if (isDown(key.DOWN)) {
        paddle.y > -max_top ? paddle.y -= PADDLE_SPEED : paddle.y = -max_top;
    }
}

function MoveLeftPaddle(elapsed_time) {
    let ball = shapeObjects[BALL];
    let paddle = shapeObjects[LEFT_PADDLE];
    paddle.y = ball.y;
}

function UpdateBallPosition(elapsed_time) {
    let ball = shapeObjects[BALL];
    let left_paddle = shapeObjects[LEFT_PADDLE];
    let right_paddle = shapeObjects[RIGHT_PADDLE];

    // collision with left paddle
    if (ball.x < left_paddle.x + ball.width) {
        const half_paddle_height = left_paddle.height / 2;
        if (ball.y < left_paddle.y + half_paddle_height && ball.y > left_paddle.y - half_paddle_height) {
            ball.step_movement_x *= -1; // invert x speed
        }
    }

    // collision with right paddle
    if (ball.x > right_paddle.x - ball.width) {
        const half_paddle_height = right_paddle.height / 2;
        if (ball.y < right_paddle.y + half_paddle_height && ball.y > right_paddle.y - half_paddle_height) {
            ball.step_movement_x *= -1; // invert x speed
        }
    }
    // collision with top and bottom border
    if (Math.abs(ball.y) >= 300 - ball.height / 2 - 5) {
        ball.step_movement_y *= -1;
    }

    ball.x += ball.step_movement_x * elapsed_time;
    ball.y += ball.step_movement_y * elapsed_time;
}

// Key Handling
let key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

function isDown (keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}