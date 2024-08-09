import { writable,derived } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import t from "./topicLite.json"
function recSearch(data,id,func){
    for(let i in data){
        if(data[i].id == id){
            return func(data[i])
        }else {
            if(!data[i].children){
                continue
            }
            var y = recSearch(data[i].children,id,func)
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
        currentEditorID:null,
        data:t
    })
    return {
        subscribe,
        addTopicHeading:(name)=>{
            var ne = {
                id: uuidv4(),
                name,
                children:[],
                numChildren:0
            }
            update((data) =>{
                data.data.push(ne)
                return data
            })
        },
        addTopicInHeading:(name)=>{
            var ne = {
                id: uuidv4(),
                name,
                editorID: uuidv4(),
                drawingID: uuidv4(),
                props:{}
            }
            update(data=>{
                for(let i in data.data){
                    if(data.data[i].id == data.currentHeading){
                        data.data[i].children.push(ne)
                        return data
                    }
                }
                throw new Error("Id not found to append child")
            })
        },
        addSubTopic:(id,name)=>{
            var ne = {
                id: uuidv4(),
                name,
                editorID: uuidv4(),
                drawingID: uuidv4(),
                props:{}
            }
            update(data =>{
                recSearch(data.data, id,(d)=>{
                    console.log(d)
        if(d.children){
            d.children.push(ne)
            d.numChildren = d.numChildren + 1
        }else{
            d.children = [ne]
            d.numChildren = 1
        }
                })
                return data
            })
        },
        setCurrentHeading:(id) =>{
            update((data)=>{
                data.currentHeading = id
                return data
            })
        },
        setCurrentTopic:(id)=>{
            update((data)=>{
                var x = recSearch(data.data,id,(d)=>{
                    return {
                        currentTopicID: d.id,
                        currentTopic: d.name,
                        currentDrawingID: d.drawingID,
                        currentEditorID: d.editorID
                    }
                })
                console.log(data)
                data.currentEditorID = x.currentEditorID
                data.currentTopicID = x.currentTopicID
                data.currentTopic = x.currentTopic
                data.currentDrawingID = x.currentDrawingID
                console.log(x)
                return data
            })
        },
        changeTopicName:(name)=>{
            update((data)=>{
                recSearch(data.data,data.currentTopicID, (d)=>{
                    d.name = name
                })
                return data
            })
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