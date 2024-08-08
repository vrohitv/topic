<script>
// @ts-nocheck

    import EditorJS from "@editorjs/editorjs";
    import Header from "@editorjs/header";
    import List from "@editorjs/list";
    import {onMount} from "svelte";


    onMount(()=>{
        const editor = new EditorJS({
        /**
         * Id of Element that should contain the Editor
         */
        holder: "editorjs",

        /**
         * Available Tools list.
         * Pass Tool's class or Settings object for each Tool you want to use
         */
        placeholder:"One Topic at a time.....",
        tools: {
            header: {
                class: Header,
                inlineToolbar: ["link"],
            },
            list: {
                class: List,
                inlineToolbar: true,
            },
        },
    });
    })
    
</script>

<div>
    <div id="editorjs">

    </div>
</div>

<style>
</style>
