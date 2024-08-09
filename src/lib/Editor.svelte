<script>
    // @ts-nocheck

    import EditorJS from "@editorjs/editorjs";
    import Header from "@editorjs/header";
    import List from "@editorjs/list";
    import { onMount } from "svelte";
    import {Drawing } from "./EditorDrawing"
    export let editor;
    let currentID
    document.addEventListener("topicOpenInEditor", async(e) => {
        var data = localStorage.getItem(e.detail);
        currentID = e.detail
        if (!data) {
            await editor.blocks.render({"time":1723084898048,"blocks":[{"id":"IxoomqzyjD","type":"paragraph","data":{"text":"Start of Something new&nbsp;"}}],"version":"2.30.2"})
            return;
        }
        await editor.blocks.render(JSON.parse(data))
        
    });
    function onChangeHandler(e) {
        editor
            .save()
            .then((outputData) => {
                console.log("Article data: ", outputData);
                localStorage.setItem(currentID,JSON.stringify(outputData))
            })
            .catch((error) => {
                console.log("Saving failed: ", error);
            });
    }
    onMount(() => {
        editor = new EditorJS({
            holder: "editorjs",
            placeholder: "One Topic at a time.....",
            tools: {
                header: {
                    class: Header,
                    inlineToolbar: ["link"],
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                },
                drawing:{
                    class:Drawing
                }
            },
            onChange: onChangeHandler,
        });
    });
</script>

<div>
    <div id="editorjs"></div>
</div>

<style>
    
</style>
