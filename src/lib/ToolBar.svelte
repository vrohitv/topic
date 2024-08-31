<script>
    // @ts-nocheck

    import {
        Toolbar,
        ToolbarButton,
        ToolbarGroup,
        Button,
        Dropdown,
        DropdownItem,
        Checkbox,
        Breadcrumb,
        BreadcrumbItem,
        Spinner
    } from "flowbite-svelte";
    import {
        HomeOutline,
        EnvelopeOutline,
        ImageOutline,
        ChevronDownOutline,
        TrashBinOutline
    } from "flowbite-svelte-icons";
    import { createEventDispatcher } from "svelte";
    import {
        topic,
        topicTreeDataRead,
        headingSelectData,
        syncTopicHeadingData,
        recSearch,
        getTopicDataFromServer,
        recSearchReturnParent
    } from "../store/topicData";
    import { spinner } from "../store/spinner";
    let innerHTML;
    const dispatch = createEventDispatcher();
    const topicTitlechange = (e) => {
        e.preventDefault()
        if (e.key == "Enter") {
            topic.update((data) => {
                recSearch(data.data, data.currentTopicID, (d) => {
                    d.name = innerHTML;
                });
                syncTopicHeadingData(data).then(() => {
                    console.log("Synced");
                });
                return data;
            });
        }
    };
    const deleteCurrentNoteBook = (e)=>{
        e.preventDefault()
            topic.update((data) => {
                recSearchReturnParent(data.data, data.currentTopicID, (d,parent) => {
                    if(d.children){
                        alert(`Please delete all the subtopics of ${d.name} before deleting .`)
                        return
                    }
                    var consent = confirm(`Are you sure you want to delete ${d.name} topic from ${parent.name}?`)
                    if(consent){
                        parent.children = parent.children.filter((child)=>child.id != d.id)
                        parent.numChildren = parent.children.length
                        if(parent.children.length == 0){
                            if(parent.editorID){
                                delete parent.children
                                delete parent.numChildren
                            }
                        }
                    }
                });
                data.currentTopicID = null
                data.currentTopic = null
                syncTopicHeadingData(data).then(() => {
                    console.log("Synced");
                });
                return data;
            });
    }
</script>

<div>
    <Toolbar>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            contenteditable
            on:keypress={topicTitlechange}
            class="p-2 whitespace-nowrap border-2 rounded"
            bind:innerHTML
        >
            {$topic.currentTopic}
        </div>
        <div class="ml-2">
            <Button on:click={deleteCurrentNoteBook} color="alternative" class="!p-2 w-[35px] h-[35 px]"
              ><TrashBinOutline class="w-5 h-5" /></Button
            >
        </div>
        {#if $spinner}
        <div>
            <Spinner/>
        </div>
        {/if}
    </Toolbar>
</div>

<style>
    ul {
        list-style: none;
    }
</style>
