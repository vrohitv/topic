// @ts-nocheck
import { writable } from 'svelte/store';
import { v4 as uuidv4 } from "uuid"
import { getDrawingData, syncTopicDrawingData } from "./DrawingBoard.helper"
export const eraserOn = writable(false)

function drawingCanvasStore() {
    const { subscribe, set, update } = writable({
        currentNoteBookID: null,
        noteBookData: []
    })
    return {
        subscribe,
        setCurrentNotebookID: async (id) => {
            console.log(id, "From store")
            var data = localStorage.getItem(id);
            if (!data) {
                var resp = await getDrawingData(id)
                if (resp.status != 200) {
                    return update((d) => {
                        d.currentNoteBookID = id
                        d.noteBookData = []
                        return d
                    })
                }
                resp = await resp.json()
                console.log(resp)
                localStorage.setItem(id, JSON.stringify(resp.drawing_data))
                var noteBookData = resp.drawing_data
                console.log(noteBookData)
            }
            update((d) => {
                d.currentNoteBookID = id
                d.noteBookData = noteBookData ? noteBookData : data
                console.log(d,"updated data")
                return d
            })
        },
        saveNotebook: (data) => {
            update(d => {
                console.log(d)
                syncTopicDrawingData(data, d.currentNoteBookID).then(() => {
                    console.log("Synced Editor Data");
                    localStorage.setItem( d.currentNoteBookID, JSON.stringify(data));
                });
                return d
            })
        }

    }

}

export const drawingStore = drawingCanvasStore()