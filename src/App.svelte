<script>
  // @ts-nocheck
  import DrawingBoard from "./lib/DrawingBoard.svelte";
  import "./app.css";
  import t from "./store/topicLite.json";
  import {
    topic,
    topicTreeDataRead,
    headingSelectData,
  } from "./store/topicData";
  import { drawingStore } from "./store/drawingStore";
  import TreeView from "./lib/TreeView.svelte";
  import { Label, Select,Spinner } from "flowbite-svelte";
  import {
    HomeOutline,
    EnvelopeOutline,
    ImageOutline,
  } from "flowbite-svelte-icons";
  import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
  import ToolBar from "./lib/ToolBar.svelte";
  import Editor from "./lib/Editor.svelte";
  import { onMount } from "svelte";
  let selected = $headingSelectData.selected;
  let drawingBoardopen = false;
  let editor;
  function headingChange() {
    topic.setCurrentHeading(selected);
  }
  function addTopicHeading(e) {
    var name = prompt("Enter your heading name");
    if (!name) {
      return;
    }
    topic.addTopicHeading(name);
  }
  function addTopicInHeading(e) {
    var name = prompt("Enter your topic name");
    if (!name) {
      return;
    }
    topic.addTopicInHeading(name);
  }
  function addSubTopic(e) {
    topic.addSubTopic(e.detail.id);
  }
  function deleteHeading(e) {}
  function deleteTopic(e) {}
  document.body.addEventListener("OpenDrawingCanvas", async(e) => {
    console.log(e.detail,"drawing canvas load");
    await drawingStore.setCurrentNotebookID(e.detail);
    drawingBoardopen = true;
  });
  let appInitialized;
  onMount(async () => {
    try {
      await topic.loadInit();
      appInitialized = true;
    } catch (error) {
      console.error(error);
    }
  });
</script>

<main class="h-full">
  {#if appInitialized}
    {#if drawingBoardopen}
      <DrawingBoard bind:drawingBoardopen />
    {/if}
    <div class="flex flex-row h-full">
      <!-- Sidebar -->
      <div
        class="flex flex-col w-[400px] h-full border-r-2 border-black grow-1"
      >
        <Label class="m-2">
          <Select
            placeholder="Select a topic"
            class="mt-2"
            on:change={headingChange}
            items={$headingSelectData.data}
            bind:value={selected}
          />
        </Label>
        <div class="grow-1 overflow-scroll relative top-[-8px]">
          <TreeView data={$topicTreeDataRead} />
        </div>
      </div>
      <!-- //EDitor -->
      <div class="grow-[3]">
        <div>
          <ToolBar
            on:addTopicHeading={addTopicHeading}
            on:addTopicInHeading={addTopicInHeading}
            on:deleteHeading={deleteHeading}
            on:deleteTopic={deleteTopic}
          ></ToolBar>
        </div>
        <div class="mx-12 max-h-[90vh] overflow-scroll">
          <Editor bind:editor></Editor>
        </div>
      </div>
    </div>
  {:else}
    <div class="text-center"><Spinner /></div>
  {/if}
</main>

<style>
</style>