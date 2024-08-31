<script>
    import { onMount, onDestroy } from "svelte";
    import { isMobileTablet } from "./utils";
    import {drawingStore} from "../store/drawingStore"
    export let drawingBoardopen;
    let canvas;
    let gl;
    let isDrawing = false;
    let isErasing = false;
    let positionBuffer;
    let positionLocation;
    let colorLocation;
    let eraser = false;
    let isMobile = isMobileTablet();
    let lastPos = null;
    let currentLine = [];
    let lines = $drawingStore.noteBookData;
    onMount(() => {
        initializeGL();
        setupEventListeners();
        paint();
    });
    onDestroy(() => {
        removeEventListeners();
    });

    function initializeGL() {
        gl = canvas.getContext("webgl");
        if (!gl) {
            console.error(
                "Unable to initialize WebGL. Your browser may not support it.",
            );
            return;
        }
        // adjust canvas size
        canvas.width = window.innerWidth - 50; // Increase the resolution
        canvas.height = window.innerHeight - 100; // Increase the resolution
        // canvas.style.width = window.innerWidth - 50; // Maintain display size
        // canvas.style.height = window.innerHeight - 100; // Maintain display size
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        const vertexShaderSource = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0, 1);
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            uniform vec4 u_color;
            void main() {
                gl_FragColor = u_color;
            }
        `;
        const vertexShader = createShader(
            gl,
            gl.VERTEX_SHADER,
            vertexShaderSource,
        );
        const fragmentShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragmentShaderSource,
        );
        const program = createProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(program);
        positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        colorLocation = gl.getUniformLocation(program, "u_color");
        gl.uniform4f(colorLocation, 0, 0, 0, 1);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function setupEventListeners() {
        if (!isMobile) {
            canvas.addEventListener("mousedown", startDrawing);
            canvas.addEventListener("mousemove", draw);
            canvas.addEventListener("mouseup", stopDrawing);
            // canvas.addEventListener("mouseleave", stopDrawing);
        } else {
            canvas.addEventListener("pointerdown", startDrawing);
            canvas.addEventListener("pointermove", draw);
            canvas.addEventListener("pointerup", stopDrawing);
            // canvas.addEventListener("pointerleave", stopDrawing);
        }
    }

    function removeEventListeners() {
        canvas.removeEventListener("pointerdown", startDrawing);
        canvas.removeEventListener("pointermove", draw);
        canvas.removeEventListener("pointerup", stopDrawing);
        // canvas.removeEventListener("pointerleave", stopDrawing);

        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", stopDrawing);
        // canvas.removeEventListener("mouseleave", stopDrawing);
    }

    function startDrawing(e) {
        if (isMobile) {
            if (e.pointerType !== "pen") {
                return;
            }
        }
        isDrawing = true;
        currentLine = [];
        draw(e);
    }

    function draw(e) {
        if (!isDrawing && !isErasing) return;
        // console.log("drawing");
        const rect = canvas.getBoundingClientRect();
        const currentPos = [e.clientX - rect.left, e.clientY - rect.top];
        if (isErasing && isDrawing) {
            // console.log("erasing");
            erase(currentPos,rect);
        } else if(isDrawing && !isErasing){
            currentLine.push(
                (currentPos[0] / canvas.width) * 2 - 1,
                (currentPos[1] / canvas.height) * -2 + 1,
            );
        }
        // currentLine.push(
        //     (currentPos[0] / canvas.width) * 2 - 1,
        //     (currentPos[1] / canvas.height) * -2 + 1,
        // );
        paint();
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(currentLine),
            gl.STATIC_DRAW,
        );
        gl.drawArrays(gl.LINE_STRIP, 0, currentLine.length / 2);

        lastPos = currentPos;
    }
    function paint() {
        gl.clear(gl.COLOR_BUFFER_BIT);

        lines.forEach((line) => {
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(line),
                gl.STATIC_DRAW,
            );
            gl.drawArrays(gl.LINE_STRIP, 0, line.length / 2);
        });
    }
    function erase(pos,rect) {
        const threshold = 0.05; // Adjust this value as needed
        const webGLPos = [
        (pos[0] / rect.width) * 2 - 1,
        (pos[1] / rect.height) * -2 + 1,
        ];
        for(let i = 0; i < lines.length; i++){
            for(let j = 0; j < lines[i].length; j+=2){
                const x = lines[i][j];
                const y = lines[i][j + 1];
                const dist = Math.sqrt(
                    (x - webGLPos[0]) ** 2 + (y - webGLPos[1]) ** 2,
                );
                if(dist < threshold){
                    // console.log("erased");
                    lines.splice(i,1);
                    return;
                }
            }
        }
    }
    function stopDrawing() {
        // console.log("stopped");
        // console.log(lines);
        if(isDrawing && !isErasing){
            lines.push([...currentLine]);
        }
        isDrawing = false;
    }
    function closeDrawingBoard() {
        // console.log(lines)
        drawingStore.saveNotebook(lines)
        drawingBoardopen = false
    }
</script>

<div class="cont">
    <div class="toolbar">
        <div class="left">
            <label class="switch">
                <input type="checkbox" bind:checked={isErasing} />
                <span class="slider">Eraser</span>
            </label>
        </div>
        <div class="right"></div>
        <div class="close">
            <button on:click={closeDrawingBoard}>Save & Close</button>
        </div>
    </div>
    <div class="canvas-cont">
        <canvas bind:this={canvas} id="drawing-canvas"></canvas>
    </div>
</div>

<style>
    .toolbar {
        height: 40px;
        /* border: 1px solid black; */
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .left {
        /* border: 1px solid black; */
        width: 25%;
        height: 80%;
        margin-left: 20px;
    }
    .right {
        /* border: 1px solid black; */
        width: 25%;
        height: 80%;
    }
    .close {
        /* border: 1px solid black; */
        width: 25%;
        height: 80%;
        margin-right: 20px;
    }
    .close button {
        /* width: 20%; */
        height: 100%;
        background-color: #f2f2f2;
        border: none;
        border-radius: 5px;
        float: right;
        border: 1px solid black;
    }
    .close button:hover {
        background-color: #e6e6e6;
    }
    .close button:active {
        background-color: #d9d9d9;
    }
    .canvas-cont {
        padding: 10px;
        height: calc(100% - 42px);
        border: 1px solid black;
        overflow: scroll;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #drawing-canvas {
        border: 1px solid black;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
        touch-action: none;
    }
    .cont {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: absolute;
        background-color: white;
        z-index: 10;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .switch {
        display: inline-block;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 34px;
    }
</style>
