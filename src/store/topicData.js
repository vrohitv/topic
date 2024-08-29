// @ts-nocheck
import { writable, derived } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
const url = "api.venkatrohit.com"
export function recSearch(data, id, func) {
    for (let i in data) {
        if (data[i].id == id) {
            return func(data[i])
        } else {
            if (!data[i].children) {
                continue
            }
            var y = recSearch(data[i].children, id, func)
            if (!y) {
                continue
            }
            return y
        }
    }
}
export async function syncTopicHeadingData(data) {
    try {
        // data.currentHeading = null
        var resp = await fetch("https://" + url + "/topic/heading", {
            method: "POST",
            headers: {
                "authorization": "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        console.log(resp)
        return resp
    } catch (e) {
        console.log(e)
    }
}
export async function getTopicDataFromServer() {
    try {
        var resp = await fetch("https://" + url + "/topic/heading", {
            method: "GET",
            headers: {
                "authorization": "Bearer " + localStorage.getItem("token")
            },
        });
        console.log(resp)
        return resp
    } catch (e) {
        console.log(e)
    }
}
export const topic = writable({
    currentHeading: null,
    currentTopic: "Untitled",
    currentTopicID: null,
    currentDrawingID: null,
    currentEditorID: null,
    data: []
})
export const topicTreeDataRead = derived(topic, ($topic) => {
    var heading = $topic.currentHeading
    if (!heading) {
        return []
    }
    for (let i in $topic.data) {
        if ($topic.data[i].id == heading) {
            return $topic.data[i].children
        }
    }
})
export const headingSelectData = derived(topic, ($topic) => {
    var arr = []
    var selected = null
    for (let i in $topic.data) {
        var stub = {
            value: $topic.data[i].id,
            name: $topic.data[i].name,
        }
        if ($topic.currentHeading == $topic.data[i].id) {
            selected = $topic.data[i].id
        }
        arr.push(stub)
    }
    return { data: arr, selected }
})
