import { writable } from 'svelte/store';
import {v4 as uuidv4} from "uuid"
export const eraserOn = writable(false)

function drawingCanvasStore(){
    const {subscribe,set,update} = writable({
        currentNoteBookID:null,
        noteBookData:[]
    })
    return {
        subscribe,
        setCurrentNotebookID:(id)=>{
            console.log(id,"From store")
            update((d) =>{
                console.log(d,"From store")
                console.log("okok","From store")
                d.currentNoteBookID = id
                var data = localStorage.getItem(id)
                console.log(data)
                if(!data){
                    d.noteBookData = []
                console.log(d,"From store")

                    return d
                }
                d.noteBookData = data
                console.log(d,"From store")
                
                return d
            })
        },
        saveNotebook:(data)=>{
            update(d=>{
                localStorage.setItem(d.currentNoteBookID,JSON.stringify(data))
                return d
            })
        }

    }

}

export const drawingStore = drawingCanvasStore()