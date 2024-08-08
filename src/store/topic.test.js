import t from "./topic.json" with { type: "json" }

// old method
function rec(data,id){
    for(let i in data){
        if(data[i].id == id){
            return id
        }else {
            if(!data[i].children){
                continue
            }
            var y =rec(data[i].children,id)
            if(!y){
                continue
            }
            return data[i].id + "?" + rec(data[i].children,id)
        }
    }
}

//old method
function parseString(st,data){
    var arr = st.split("?")
    var currentString = null
    var depth = arr.length
    for(let i in data){
        if(data[i].id == arr[0]){
            currentString = data[i]
            depth = depth - 1
            arr.shift()
        }
    }
    if(!currentString){
        return 0
    }
    console.log(arr)
    for(let i in arr){
        if(!currentString.children){
            console.log(currentString)
            console.log("Boom")
            return 1
        }
        for(let j in currentString.children){
            console.log(arr[i])
            console.log(currentString.children[j])
            if(currentString.children[j].id == arr[i]){
                console.log(depth)
                if(depth == 1){
                    console.log(currentString)
                    return 1
                }
                currentString = currentString.children[j]
                depth = depth - 1
                break
            }
        }
    }
}
// parseString(rec(t,"a73a220b-ad88-4154-a11a-e04f5883db49"),t)


// new recursive funciton
// takes in data, id and manipulation function
// func takes in data
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

console.log(recSearch(t,"105d40d2-d80c-4bae-b931-858b9a658878"))
