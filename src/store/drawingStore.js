// @ts-nocheck
import { writable } from 'svelte/store';
import { v4 as uuidv4 } from "uuid"
import { getDrawingData, syncTopicDrawingData } from "./DrawingBoard.helper"
import { spinner } from './spinner';
export const eraserOn = writable(false)

function drawingCanvasStore() {
    const { subscribe, set, update } = writable({
        currentNoteBookID: null,
        noteBookData: []
    })
    return {
        subscribe,
        setCurrentNotebookID: async (id) => {
            spinner.set(true)
            console.log("spin")
            var resp = await getDrawingData(id)
            if (resp.status != 200) {
                console.log("spind")
                spinner.set(false)
                return update((d) => {
                    d.currentNoteBookID = id
                    d.noteBookData = []
                    return d
                })
            }
            resp = await resp.json()
            console.log(resp, "Respo")
            var noteBookData = resp.drawing_data
            console.log(noteBookData)
            update((d) => {
                d.currentNoteBookID = id
                d.noteBookData = []
                if(!noteBookData.length == 0){
                    for(let i in noteBookData){
                        noteBookData[i].stageData = JSON.parse(noteBookData[i].stageData)
                    }
                    d.noteBookData = noteBookData
                }
                console.log(d, "updated data")
                return d
            })
            console.log("spind")
            spinner.set(false)
        },
        saveNotebook: (data) => {
            update(d => {
                console.log(d)
                syncTopicDrawingData(data, d.currentNoteBookID).then(() => {
                    console.log("Synced Editor Data");
                    localStorage.setItem(d.currentNoteBookID, JSON.stringify(data));
                });
                return d
            })
        }

    }

}

export const drawingStore = drawingCanvasStore()