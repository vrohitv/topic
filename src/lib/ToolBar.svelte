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
    } from "flowbite-svelte";
    import {
        HomeOutline,
        EnvelopeOutline,
        ImageOutline,
        ChevronDownOutline,
    } from "flowbite-svelte-icons";
    import { createEventDispatcher } from "svelte";
    import {
        topic,
        topicTreeDataRead,
        headingSelectData,
        syncTopicHeadingData,
        recSearch,
        getTopicDataFromServer,
    } from "../store/topicData";
    let innerHTML;
    const dispatch = createEventDispatcher();
    const topicTitlechange = (e) => {
        if (e.key == "Enter") {
            console.log(innerHTML);
            update((data) => {
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
    </Toolbar>
</div>

<style>
    ul {
        list-style: none;
    }
</style>
