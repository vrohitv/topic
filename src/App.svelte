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
  import TreeView from "./lib/TreeView.svelte";
  import { Label, Select } from "flowbite-svelte";
  import {
    HomeOutline,
    EnvelopeOutline,
    ImageOutline,
  } from "flowbite-svelte-icons";
  import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
  import ToolBar from "./lib/ToolBar.svelte";
  import Editor from "./lib/Editor.svelte";
  import { drawingStore } from "./store/drawingStore";
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
    console.log(e.detail.id);
    topic.addSubTopic(e.detail.id);
  }
  function deleteHeading(e) {}
  function deleteTopic(e) {}
  document.body.addEventListener("OpenDrawingCanvas", (e) => {
    console.log(e.detail);
    drawingStore.setCurrentNotebookID(e.detail);
    drawingBoardopen = true;
  });
</script>

<main>
  {#if drawingBoardopen}
    <DrawingBoard bind:drawingBoardopen />
  {/if}
  <div class="flex flex-row">
    <!-- Sidebar -->
    <div class="w-[400px] h-full border-r-2 border-black grow-1">
      <Label class="m-2">
        <Select
          placeholder="Select a topic"
          class="mt-2"
          on:change={headingChange}
          items={$headingSelectData.data}
          bind:value={selected}
        />
      </Label>
      <div
        class="mr-2 w-[400px] h-[90vh] overflow-scroll relative top-[-8px] right-[8px]"
      >
        <TreeView data={$topicTreeDataRead} />
      </div>
    </div>
    <!-- //EDitor -->
    <div class="grow-[3] max-h-[100vh] overflow-scroll">
      <div>
        <ToolBar
          on:addTopicHeading={addTopicHeading}
          on:addTopicInHeading={addTopicInHeading}
          on:deleteHeading={deleteHeading}
          on:deleteTopic={deleteTopic}
        ></ToolBar>
      </div>
      <div class="mx-12">
        <Editor bind:editor></Editor>
      </div>
    </div>
  </div>
</main>

<style>
</style>
