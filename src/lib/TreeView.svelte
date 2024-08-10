<script>
    // @ts-nocheck

    import { Button, Badge } from "flowbite-svelte";
    import { PlusOutline, AngleRightOutline } from "flowbite-svelte-icons";
    export let data = [];
    import { createEventDispatcher, onDestroy } from "svelte";
    import { topic } from "../store/topicData";
    const dispatch = createEventDispatcher();
    const goToTopic = (e) => {
        var el = e.target;
        while (el.nodeName != "LI") {
            // console.log(el)
            el = el.parentNode;
        }
        // console.log(el);
        topic.setCurrentTopic(el.id)
        document.dispatchEvent(new CustomEvent("topicOpenInEditor",{detail:el.id}))
    };
    const addSubTopic = (e) => {
        var el = e.target;
        while (el.nodeName != "LI") {
            // console.log(el)
            el = el.parentNode;
        }
        var name = prompt("Enter your heading name");
        if (!name) {
            return;
        }
        console.log(el);
        topic.addSubTopic(el.id,name);
    };
</script>

<ul>
    {#each data as data}
        {#if data.children}
            <li id={data.id}>
                <details open>
                    <summary
                        class="mb-4 rounded outline h-[36px] flex justify-between flex-row items-center"
                    >
                        <div class="ml-2 max-w-[50%] truncate">
                            <p>{data.name}</p>
                        </div>
                        <div class="relative top-[4px]">
                            <Button
                                on:click={addSubTopic}
                                color="dark"
                                outline={true}
                                class="mx-2 !p-2 w-[20px] h-[20px] bg-transparent"
                                ><PlusOutline class="w-5 h-5" /></Button
                            >
                            <Button
                                on:click={goToTopic}
                                color="dark"
                                outline={true}
                                class="mr-2 !p-2 w-[20px] h-[20px] bg-transparent"
                                ><AngleRightOutline class="w-5 h-5" /></Button
                            >
                            <Badge class="relative bottom-[6px] right-1"
                                >{data.numChildren}</Badge
                            >
                        </div>
                    </summary>
                    <svelte:self data={data.children} />
                </details>
            </li>
        {:else}
            <li
                id={data.id}
                class="mb-4 rounded h-[36px] flex justify-between flex-row items-center outline"
            >
                <div class="ml-2 truncate max-w-[60%]">
                    <p>{data.name}</p>
                </div>
                <div class="relative top-[4px]">
                    <Button
                        on:click={addSubTopic}
                        color="dark"
                        outline={true}
                        class="mx-2 !p-2 w-[20px] h-[20px] bg-transparent"
                        ><PlusOutline class="w-5 h-5" /></Button
                    >
                    <Button
                        on:click={goToTopic}
                        color="dark"
                        outline={true}
                        class="mr-2 !p-2 w-[20px] h-[20px] bg-transparent"
                        ><AngleRightOutline class="w-5 h-5" /></Button
                    >
                </div>
            </li>
        {/if}
    {/each}
</ul>

<style>
    ul {
        list-style: none;
        line-height: 2em;
    }
    summary {
        cursor: pointer;
    }
    summary::marker,
    summary::-webkit-details-marker {
        content: "";
        display: none !important;
    }
    ul li {
        position: relative;
        /* outline:1px solid green; */
    }
    ul li::before {
        position: absolute;
        left: -10px;
        top: -1em;
        border-left: 2px solid gray;
        border-bottom: 2px solid gray;
        content: "";
        width: 8px;
        height: 2em;
    }
    ul li::after {
        position: absolute;
        left: -10px;
        bottom: 0px;
        border-left: 2px solid gray;
        content: "";
        width: 8px;
        height: 100%;
    }
    ul li:last-child::after {
        display: none;
    }
    li {
        min-width: 250px;
    }
</style>
