import { writable,derived } from 'svelte/store';
import t from "./topicLite.json"
function recSearch(data,id,func){
    for(let i in data){
        if(data[i].id == id){
            return func(data[i])
        }else {
            if(!data[i].children){
                continue
            }
            var y = recSearch(data[i].children,id)
            if(!y){
                continue
            }
            return y
        }
    }
}

function topicHeadandMeta(){
    const {subscribe, update ,set} = writable({})
    set({
        currentHeading:"5711dcf0-9733-4e21-b119-c6a8b0c73f6a",
        currentTopic:"Untitled",
        currentTopicID:null,
        currentDrawingID:null,
        data:t
    })
    return {
        subscribe,
        addTopicHeading:(name)=>{
            var ne = {
                id: crypto.randomUUID(),
                name,
                editorID: crypto.randomUUID(),
                drawingID: crypto.randomUUID(),
                props:{}
            }
            update((data) =>{
                    
            })
        },
        setCurrentHeading:(id) =>{
            update((data)=>{
                data.currentHeading = id
                return data
            })
        },
        setCurrentTopic:(id)=>{

        }
    }   
}

export const topic = topicHeadandMeta()


export const topicTreeDataRead = derived(topic,($topic)=>{
    var heading = $topic.currentHeading
    for(let i in $topic.data){
        if($topic.data[i].id == heading){
            return $topic.data[i].children
        }
    }
    throw new Error("Heading Not found")
})

export const headingSelectData = derived(topic,($topic)=>{
    var arr = []
    var selected = null
    for(let i  in $topic.data){
        var stub = {
            value:$topic.data[i].id,
            name:$topic.data[i].name,
        }
        if($topic.currentHeading == $topic.data[i].id){
            selected = $topic.data[i].id
        }
        arr.push(stub)
    }
    return {data:arr,selected}
})