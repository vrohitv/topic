<script>
    // @ts-nocheck

    import Konva from "konva";
    import { onMount } from "svelte";
    import {eraserOn} from "../store/drawingStore";
    export let stage;
    export let height;
    export let width;
    export let pageID;

    // export let path;
    onMount(() => {
        console.log(stage)
        if(Object.keys(stage).length == 0){
            stage = new Konva.Stage({
            container: pageID,
            width: parseInt(width),
            height: parseInt(height) - 25,
        });
        }else{
            stage = Konva.Node.create(stage,pageID)
        }
        console.log(stage)
        var layer = new Konva.Layer();
        stage.add(layer);

        var isPaint = false;
        var lastLine;
        

        stage.on("pointerdown", function (e) {
            if(e.evt.pointerType != "pen"){
                return
            }
            isPaint = true;
            var pos = stage.getPointerPosition();
            lastLine = new Konva.Line({
                stroke: "#000000",
                strokeWidth: $eraserOn ? 20 : 2,
                globalCompositeOperation:
                    $eraserOn ? "destination-out" : "source-over",
                // round cap for smoother lines
                lineCap: "round",
                lineJoin: "round",
                // add point twice, so we have some drawings even on a simple click
                points: [pos.x, pos.y, pos.x, pos.y],
            });
            layer.add(lastLine);
        });

        stage.on("pointerup", function () {
            isPaint = false;
        });

        // and core function - drawing
        stage.on("pointermove", function (e) {
            if (!isPaint) {
                return;
            }
            e.evt.preventDefault();

            const pos = stage.getPointerPosition();
            var newPoints = lastLine.points().concat([pos.x, pos.y]);
            lastLine.points(newPoints);
        });
    });
</script>

<div>
    <div id={pageID} class=" border-2 mb-2 drawing"></div>
</div>

<style>
    /* .drawing{
        touch-action: none;
    } */
</style>
