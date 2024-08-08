import { faker } from '@faker-js/faker';
import {v4 as uuid} from "uuid";
import {writeFile} from 'fs';

function recursiveGenerate(n){
    if(n == 0){
        return
    }
    var arr = []
    for(let i = 0; i <= n;i++){

        var j = {
            id:uuid(),
            name:faker.person.fullName(),
            editorID: uuid(),
            drawingID:uuid(),
            props:{},
            children: recursiveGenerate(n - 1)
        }
        j.children ? j.numChildren = j.children.length : ""
        arr.push(j)
    }
    return arr
}

var jso = {
    id:uuid(),
    name:faker.person.fullName(),
    children:[

    ]
}
var finArr = []
for(let i = 0; i < 5; i++){
    var clone = structuredClone(jso)
    clone.id = uuid()
    clone.name = faker.person.fullName()
    clone.children = recursiveGenerate(5)
    clone.numChildren = clone.children.length
    finArr.push(clone)
}

writeFile('topic.json', JSON.stringify(finArr), 'utf8', ()=>{});