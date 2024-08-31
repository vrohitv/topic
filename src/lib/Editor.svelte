<script>
    // @ts-nocheck

    import EditorJS from "@editorjs/editorjs";
    import Header from "@editorjs/header";
    import Paragraph from "@editorjs/paragraph";
    import Quote from "@editorjs/quote";
    import Warning from "@editorjs/warning";
    import Delimiter from "@editorjs/delimiter";
    import NestedList from "@editorjs/nested-list";
    import Checklist from "@editorjs/checklist";
    import SimpleImage from "@editorjs/simple-image";
    import Table from "@editorjs/table";
    import CodeTool from "@editorjs/code";
    import Marker from "@editorjs/marker";
    import InlineCode from "@editorjs/inline-code";
    import Underline from "@editorjs/underline";
    import CodeBox from '@bomdi/codebox';
    // import LinkTool from '@editorjs/link';
    // import ImageTool from '@editorjs/image';
    // import AttachesTool from '@editorjs/attaches';
    import { onMount } from "svelte";
    import { Drawing } from "./EditorDrawing";
    import { getEditorData, syncTopicEditorData } from "./Editor.helper";
    import { spinner } from "../store/spinner";
    export let editor;
    export let currentTopicID;
    $: {
        setEditorData(currentTopicID);
    }
    // document.addEventListener("topicOpenInEditor", async (e) => {
    async function setEditorData(id) {
        console.log("setting Editor data running");
        var currentID = id;
        spinner.set(true);
        // console.log("spin")
        // console.log("Event Caught:");
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
            // console.log("spind")
            spinner.set(false);
            return;
        }
        resp = await resp.json();
        // console.log(resp);
        await editor.blocks.render(resp.editor_data);
        // console.log("spind")
        spinner.set(false);
    }
    async function onChangeHandler(e) {
        spinner.set(true);
        console.log("spin");
        var outputData = await editor.save();
        console.log("Article data: ", outputData);
        var resp = await syncTopicEditorData(outputData, currentTopicID);
        console.log("spind");
        spinner.set(false);
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
                drawing: {
                    class: Drawing,
                },
                // paragraph: {
                //     class: Paragraph,
                //     inlineToolbar: true,
                // },
                quote: Quote,
                warning: Warning,
                delimiter: Delimiter,
                list: {
                    class: NestedList,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: "unordered",
                    },
                },
                checklist: {
                    class: Checklist,
                    inlineToolbar: true,
                },
                image: SimpleImage,
                table: Table,
                code: CodeTool,
                Marker: {
                    class: Marker,
                    // shortcut: "CMD+SHIFT+M",
                },
                inlineCode: {
                    class: InlineCode,
                    shortcut: "CMD+SHIFT+M",
                },
                underline: Underline,
                codeBox: {
                    class: CodeBox,
                    config: {
                        themeURL:
                            "https://cdn.jsdelivr.net/npm/highlightjs@9.16.2/styles/default.css", // Optional
                        themeName: "default", // Optional
                        useDefaultTheme: "light", // Optional. This also determines the background color of the language select drop-down
                    },
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
