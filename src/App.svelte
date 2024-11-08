<script>
  // @ts-nocheck
  import { v4 as uuidv4 } from "uuid";
  import "./app.css";
  import { onMount } from "svelte";
  //Components
  import DrawingBoard from "./lib/DrawingBoard.svelte";
  import ToolBar from "./lib/ToolBar.svelte";
  import Editor from "./lib/Editor.svelte";
  import TreeView from "./lib/TreeView.svelte";
  import { spinner } from "./store/spinner";
  import { getEditorData, syncTopicEditorData } from "./lib/Editor.helper";

  import {
    Label,
    Select,
    Spinner,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Dropdown,
    DropdownItem,
    P,
  } from "flowbite-svelte";
  import {
    HomeOutline,
    EnvelopeOutline,
    ImageOutline,
    ChevronDownOutline,
    PlusOutline,
    TrashBinOutline,
  } from "flowbite-svelte-icons";

  // Stores
  import {
    topic,
    topicTreeDataRead,
    headingSelectData,
    syncTopicHeadingData,
    recSearch,
    getTopicDataFromServer,
  } from "./store/topicData.js";
  import { drawingStore } from "./store/drawingStore";

  // Variables
  let selected = $headingSelectData.selected;
  let drawingBoardopen = false;
  let editor;
  let dropDownOpen = false;
  let currentTopicID = null;
  // Interactivity
  $: {
    selected = selected ? selected : "Choose Heading";
  }
  // Handle Topic Heading Changes to a different one
  function headingChange(data1) {
    selected = data1.name;
    // topic.setCurrentHeading(data1.value);
    topic.update((data) => {
      data.currentHeading = data1.value;
      return data;
    });
    dropDownOpen = false;
  }
  // Handle Topic Open in Editor
  async function currentTopicChangeFunction(e){
    var el = e.target;
        while (el.nodeName != "LI") {
            // console.log(el)
            el = el.parentNode;
        }
        topic.update((data) => {
                var x = recSearch(data.data, el.id, (d) => {
                    return {
                        currentTopicID: d.id,
                        currentTopic: d.name,
                        currentDrawingID: d.drawingID,
                        currentEditorID: d.editorID
                    }
                })
                data.currentEditorID = x.currentEditorID
                data.currentTopicID = x.currentTopicID
                data.currentTopic = x.currentTopic
                data.currentDrawingID = x.currentDrawingID
                return data
            })
            console.log("setting Editor data running");
            currentTopicID = el.id;
        var currentID = el.id;
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
  // Handle add Topic Heading
  function addTopicHeading(e) {
    e.preventDefault();
    var name = prompt("Enter your heading name");
    if (!name) {
      return;
    }
    var ne = {
      id: uuidv4(),
      name,
      children: [],
      numChildren: 0,
    };
    topic.update((data) => {
      data.data.push(ne);
      syncTopicHeadingData(data).then(() => {
        console.log("Synced");
      });
      return data;
    });
  }
  // Add the first Topic in a Heading
  function addTopicInHeading(e) {
    var name = prompt("Enter your topic name");
    if (!name) {
      return;
    }
    var ne = {
      id: uuidv4(),
      name,
      editorID: uuidv4(),
      drawingID: uuidv4(),
      props: {},
    };
    topic.update((data) => {
      for (let i in data.data) {
        if (data.data[i].id == data.currentHeading) {
          data.data[i].children.push(ne);
          syncTopicHeadingData(data).then(() => {
            console.log("Synced");
          });
          return data;
        }
      }
      throw new Error("Id not found to append child");
    });
    dropDownOpen = false;
  }
  function addSubTopic(e) {
    var id = e.detail.id;
    var ne = {
      id: uuidv4(),
      name,
      editorID: uuidv4(),
      drawingID: uuidv4(),
      props: {},
    };
    update((data) => {
      recSearch(data.data, id, (d) => {
        if (d.children) {
          d.children.push(ne);
          d.numChildren = d.numChildren + 1;
        } else {
          d.children = [ne];
          d.numChildren = 1;
        }
      });
      syncTopicHeadingData(data).then(() => {
        console.log("Synced");
      });
      return data;
    });
  }
  function deleteHeading(e) {
    debugger
    if($topic.currentHeading == null){
      return
    }
    topic.update((data) => {
      for (let i in data.data) {
        if (data.data[i].id == data.currentHeading) {
          if(data.data[i].children.length > 0){
            alert("Please delete all the topics in the heading before deleting the heading")
            return
          }
        }
      }
      data.data = data.data.filter((child) => child.id != data.currentHeading);
      data.currentHeading = null;
      syncTopicHeadingData(data).then(() => {
        console.log("Synced");
      });
      return data;
    });
  }
  document.body.addEventListener("OpenDrawingCanvas", async (e) => {
    console.log(e.detail, "drawing canvas load");
    await drawingStore.setCurrentNotebookID(e.detail);
    drawingBoardopen = true;
  });
  let appInitialized;
  onMount(async () => {
    try {
      var data = await getTopicDataFromServer();
      if (data.status != 200) {
        data = {
          currentHeading: null,
          currentTopic: "Untitled",
          currentTopicID: null,
          currentDrawingID: null,
          currentEditorID: null,
          data: [],
        };
        topic.set(data);
        appInitialized = true;
        return;
      }
      data = await data.json();
      data.topicTree.currentTopicID = null;
      data.topicTree.currentHeading = null;
      console.log(data);
      topic.set(data.topicTree);
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
      <div class="flex flex-col w-[400px] h-full border-r-2 grow-1">
        <div class="flex flex-row align-middle justify-between p-4 bg-white">
          <Button color="alternative"
            >{selected}<ChevronDownOutline
              class="w-6 h-6 ms-2 text-white dark:text-white"
            /></Button
          >
          <Dropdown
            bind:open={dropDownOpen}
            class="pl-0 m-0 list-none w-48 overflow-y-auto h-48"
          >
            {#each $headingSelectData.data as data}
              <DropdownItem
                on:click={headingChange(data)}
                class="flex items-center text-base font-semibold gap-2"
              >
                <P>{data.name}</P>
              </DropdownItem>
            {/each}
            <a
              slot="footer"
              on:click={addTopicHeading}
              href="/"
              class="flex items-center px-3 py-2 -mb-1 text-sm text-slate-950 font-medium600 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-primary-500 hover:underline"
            >
              Add new heading
            </a>
          </Dropdown>
          <div class="flex flex-row align-center text-center">
            <Button
              on:click={addTopicInHeading}
              color="alternative"
              class="!p-2 mr-2 w-[40px] h-[40px]"
              ><PlusOutline class="w-5 h-5 " /></Button
            >
            <Button
              on:click={deleteHeading}
              color="alternative"
              class="!p-2 w-[40px] h-[40px]"
              ><TrashBinOutline class="w-5 h-5" /></Button
            >
          </div>
        </div>
        <div class="grow-1 overflow-scroll relative top-[-8px]">
          <TreeView data={$topicTreeDataRead} currentTopicChangeFunction={currentTopicChangeFunction} />
        </div>
      </div>
      <!-- //EDitor -->
      {#if $topic.currentTopicID != null}
        <div class="grow-[3]">
          <div>
            <ToolBar></ToolBar>
          </div>
          <div class="mx-12 max-h-[90vh] overflow-scroll">
            <Editor bind:editor bind:currentTopicID></Editor>
          </div>
        </div>
      {:else}
        <div class="flex justify-center w-full">
          <p>Please select a topic....</p>
        </div>
      {/if}
    </div>
  {:else}
    <div class="relative top-[50%] text-center"><Spinner /></div>
  {/if}
</main>

<style>
</style>
