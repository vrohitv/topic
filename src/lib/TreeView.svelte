<script>
    // @ts-nocheck

    import { Button, Badge } from "flowbite-svelte";
    import { v4 as uuidv4 } from "uuid";

    import { PlusOutline, AngleRightOutline } from "flowbite-svelte-icons";
    export let data = [];
    import { createEventDispatcher, onDestroy } from "svelte";
    import {
        topic,
        topicTreeDataRead,
        headingSelectData,
        syncTopicHeadingData,
        recSearch,
        getTopicDataFromServer,
    } from "../store/topicData.js";
    const dispatch = createEventDispatcher();
    export let currentTopicChangeFunction = () => {};
    const goToTopic = (e) => {
        console.log(currentTopicChangeFunction);
        console.log(e);
        currentTopicChangeFunction(e);
    };
    const gotToTopicRecForward = (e)=>{
        console.log("callled")
        dispatch("topicOpenInEditor", e);
    }
    const addSubTopic = (e) => {
        var el = e.target;
        while (el.nodeName != "LI") {
            // console.log(el)
            el = el.parentNode;
        }
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
            console.log(data)
            recSearch(data.data, el.id, (d) => {
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
            console.log(data)
            return data;
        });
    };
</script>

<ul>
    {#each data as data}
        {#if data.children}
            <li id={data.id}>
                <details open>
                    <summary
                        class="mb-4 rounded border-2 h-[36px] flex justify-between flex-row items-center"
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
                            <Badge
                                color="dark"
                                class="relative bottom-[6px] right-1"
                                >{data.numChildren}</Badge
                            >
                        </div>
                    </summary>
                    <svelte:self data={data.children} currentTopicName={currentTopicName} on:topicOpenInEditor={gotToTopicRecForward}/>
                </details>
            </li>
        {:else}
            <li
                id={data.id}
                class="mb-4 rounded h-[36px] flex justify-between flex-row items-center border-2"
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
    :root {
        --tree-line-color: #eeeeee;
    }
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
        margin-right: 8px;
        /* outline:1px solid green; */
    }
    ul li::before {
        position: absolute;
        left: -10px;
        top: -1.12em;
        border-left: 2px solid var(--tree-line-color);
        border-bottom: 2px solid var(--tree-line-color);
        content: "";
        width: 8px;
        height: 2.3em;
    }
    ul li::after {
        position: absolute;
        left: -10px;
        bottom: 0px;
        border-left: 2px solid var(--tree-line-color);
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
