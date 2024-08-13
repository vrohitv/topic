<script>
    // @ts-nocheck

    import EditorJS from "@editorjs/editorjs";
    import Header from "@editorjs/header";
    import List from "@editorjs/list";
    import { onMount } from "svelte";
    import { Drawing } from "./EditorDrawing";
    import { getEditorData, syncTopicEditorData } from "./Editor.helper";
    import {spinner} from "../store/spinner"
    export let editor;
    let currentID;

    document.addEventListener("topicOpenInEditor", async (e) => {
        currentID = e.detail;
        spinner.set(true)
        console.log("spin")

        var resp = await getEditorData(currentID);
        if (resp.status != 200) {
            await editor.blocks.render({
                time: 1723084898048,
                blocks: [
                    {
                        id: "IxoomqzyjD",
                        type: "paragraph",
                        data: { text: "..." },
                    },
                ],
                version: "2.30.2",
            });
            console.log("spind")
            spinner.set(false)
            return
        }
        resp = await resp.json();
        // console.log(resp);
        await editor.blocks.render(resp.editor_data);
        console.log("spind")
        spinner.set(false)
    });
    async function onChangeHandler(e) {
        spinner.set(true)
        console.log("spin")
        var outputData  = await editor.save()
        console.log("Article data: ", outputData);
        var resp = await syncTopicEditorData(outputData, currentID)
        console.log("spind")
        spinner.set(false)
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
                drawing: {
                    class: Drawing,
                },
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
