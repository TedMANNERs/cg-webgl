//
// Computer Graphics
//
// WebGL Exercises
//
import * as Color from "../color.js"
import {Rectangle} from "./Rectangle.js"

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
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
    let ball = new Rectangle(gl, ctx, 0, 0, 20, 20, Color.WHITE);
    ball.setUpBuffer();
    shapeObjects[BALL] = ball;

    let divider = new Rectangle(gl, ctx, 0, 0, 600, 3, Color.WHITE);
    divider.setUpBuffer();
    shapeObjects[DIVIDER] = divider;

    let leftPaddle = new Rectangle(gl, ctx, -370, 0, 80, 20, Color.WHITE);
    leftPaddle.setUpBuffer();
    shapeObjects[LEFT_PADDLE] = leftPaddle;

    let rightPaddle = new Rectangle(gl, ctx, 370, 0, 80, 20, Color.WHITE);
    rightPaddle.setUpBuffer();
    shapeObjects[RIGHT_PADDLE] = rightPaddle;
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

// Key Handling
var key = {
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