<script>
// @ts-nocheck

    import { Button,Badge } from 'flowbite-svelte';
    import { PlusOutline, AngleRightOutline } from 'flowbite-svelte-icons';
    export let data = [];
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    const goToTopic = (e) => {
        dispatch("goToTopic", {
            text: "Hello!",
        });
    };
    const addSubTopic = (e) => {
        dispatch("addSubTopic", {
            text: "Hello!",
        });
    };
</script>

<ul>
    {#each data as data}
        {#if data.children}
        <li>
            <details open>
                <summary class="mb-4 rounded outline h-[36px] flex justify-between flex-row items-center"> 
                    <div class="ml-2 truncate">
                        <p>{data.name}</p>
                    </div>
                    <div class="relative top-[4px]">
                        <Button on:click={addSubTopic(data.id)}  color="dark" outline={true} class="mx-2 !p-2 w-[25px] h-[25px] bg-transparent"><PlusOutline class="w-6 h-6" /></Button>
                        <Button on:click={goToTopic(data.id)} color="dark" outline={true} class="mr-2 !p-2 w-[25px] h-[25px] bg-transparent"><AngleRightOutline class="w-6 h-6" /></Button>
                        <Badge class="relative bottom-[6px] right-1">{data.numChildren}</Badge>
                    </div>
                </summary>
                <svelte:self data={data.children}/>
            </details>
        </li>
        {:else}
        <li class="mb-4  rounded h-[36px] flex justify-between flex-row items-center outline">
            <div class="ml-2 truncate max-w-[50%]">
                <p>{data.name}</p>
            </div>
            <div class="relative top-[4px]">
                <Button on:click={addSubTopic(data.id)}  color="dark" outline={true} class="mx-2 !p-2 w-[25px] h-[25px] bg-transparent"><PlusOutline class="w-6 h-6" /></Button>
                <Button on:click={goToTopic(data.id)} color="dark" outline={true} class="mr-2 !p-2 w-[25px] h-[25px] bg-transparent"><AngleRightOutline class="w-6 h-6" /></Button>
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
        top:-1em;
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
