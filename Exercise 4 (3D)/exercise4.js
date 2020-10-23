//
// Computer Graphics
//
// WebGL Exercises
//
import * as Color from "../color.js"
import {WireFrameCube} from "./wireFrameCube.js"

// Register function to call after document has loaded
window.onload = startup;

// global variables
let gl; // the gl object is saved globally

// we keep all local parameters for the program in a single object
let ctx = {
    shaderProgram: -1, //wird unten wieder überschrieben
    aVertexPositionId: -1,
    aVertexColorId: -1,
    uProjectionMatId: -1,
    uModelMatId: -1
};

// names of the objects we want to draw
const CUBE = "cube";

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

// dictionary with all the objects we want to draw.
const shapeObjects = {};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    const canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
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
    ctx.uViewMatId = gl.getUniformLocation(ctx.shaderProgram, "uViewMat");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict"
    shapeObjects[CUBE] = new WireFrameCube(gl, ctx, 0, 0, 0, 5, 5, 5, Color.RED);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set up the projection matrix for world coordinates
    let projectionMat = mat4.create();
    const fov_y = glMatrix.toRadian(45);
    mat4.perspective(projectionMat, fov_y, gl.drawingBufferWidth/gl.drawingBufferHeight, 0.1, 100);
    gl.uniformMatrix4fv(ctx.uProjectionMatId , false , projectionMat);

    // Set up the view matrix for the camera
    let viewMat = mat4.create();
    mat4.lookAt(viewMat,
        vec3.fromValues(10,10,5), // Camera position in world space
        vec3.fromValues(0,0,0), // looks at origin
        vec3.fromValues(0,1,0), // Head is up (set to 0,-1,0 to look upside-down)
        );
    gl.uniformMatrix4fv(ctx.uViewMatId , false , viewMat);


    // add drawing routines here
    for (const [key, shape] of Object.entries(shapeObjects)) {
        shape.draw()
    }
    console.log("done");
}