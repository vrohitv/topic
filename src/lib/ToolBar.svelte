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
    import {topic} from "../store/topicData"
    let innerHTML;
    const dispatch = createEventDispatcher();
    const topicTitlechange = (e)=>{
        if(e.key == "Enter"){
            console.log(innerHTML)
        }
    }
    const handleAddHeading = (e) => {
        dispatch("addTopicHeading", {
            id:e
        });
    };
    const handleAddTopic = (e) => {
        dispatch("addTopicInHeading", {
            id:e
        });
    };
    const deleteHeading = (e) => {
        dispatch("deleteHeading", {
            id:e
        });
    };
    const deleteTopic = (e) => {
        dispatch("deleteTopic", {
            id:e
        });
    };
</script>

<div>
    <Toolbar>
        <Button class="mr-2" size="sm"
            >Add<ChevronDownOutline
                class="w-6 h-6 ms-2 text-white dark:text-white"
            /></Button
        >
        <Dropdown class="list-none list-outside">
            <DropdownItem on:click={handleAddHeading}>Add Heading</DropdownItem>
            <DropdownItem on:click={handleAddTopic}>Add Topic</DropdownItem>
        </Dropdown>
        <Button class="mr-2" size="sm"
            >Delete<ChevronDownOutline
                class="w-6 h-6 ms-2 text-white dark:text-white"
            /></Button
        >
        <Dropdown class="list-none list-outside">
            <DropdownItem on:click={handleAddHeading}>Delete Heading</DropdownItem>
            <DropdownItem on:click={handleAddTopic}>Delete Topic</DropdownItem>
        </Dropdown>
        <!-- <ToolbarButton><HomeOutline class="w-6 h-6" /></ToolbarButton>
        <ToolbarButton><EnvelopeOutline class="w-6 h-6" /></ToolbarButton>
        <ToolbarButton><ImageOutline class="w-6 h-6" /></ToolbarButton>
        <Breadcrumb aria-label="Default breadcrumb example">
            <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
            <BreadcrumbItem href="/">Projects</BreadcrumbItem>
            <BreadcrumbItem>Flowbite Svelte</BreadcrumbItem>
        </Breadcrumb> -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div contenteditable on:keypress={topicTitlechange} class="p-2 border-2 rounded" bind:innerHTML={innerHTML}>
            {$topic.currentTopic}
        </div>
    </Toolbar>
</div>

<style>
    ul {
        list-style: none;
    }
</style>
