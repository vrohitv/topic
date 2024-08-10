<script>
    // @ts-nocheck

    import EditorJS from "@editorjs/editorjs";
    import Header from "@editorjs/header";
    import List from "@editorjs/list";
    import { onMount } from "svelte";
    import { Drawing } from "./EditorDrawing";
    import { getEditorData, syncTopicEditorData } from "./Editor.helper";
    export let editor;
    let currentID;

    document.addEventListener("topicOpenInEditor", async (e) => {
        var data = localStorage.getItem(e.detail);
        currentID = e.detail;
        if (!data) {
            var resp =  await getEditorData(currentID)
            if(resp.status != 200){
            return await editor.blocks.render({
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
            }
            resp = await resp.json()
            console.log(resp)
            localStorage.setItem(currentID,JSON.stringify(resp.editor_data))
            return await editor.blocks.render(resp.editor_data);
        }
        await editor.blocks.render(JSON.parse(data));
    });
    function onChangeHandler(e) {
        editor
            .save()
            .then((outputData) => {
                console.log("Article data: ", outputData);
                syncTopicEditorData(outputData, currentID).then(() => {
                    console.log("Synced Editor Data");
                    localStorage.setItem(currentID, JSON.stringify(outputData));
                });
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
