<script>
    export let data = [];
</script>

<ul class="tree">
    {#each data as data}
        {#if data.children}
        <li>
            <details open>
                <summary class="mb-4 outline"> {data.name} </summary>
                <svelte:self data={data.children}/>
            </details>
        </li>
        {:else}
        <li class="mb-4 outline">{data.name}</li>
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
</style>
