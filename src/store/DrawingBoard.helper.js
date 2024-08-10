// @ts-nocheck
const url = "api.venkatrohit.com"

export async function getDrawingData(id) {
    try {
        var resp = await fetch("https://" + url + "/topic/drawing?id="+id, {
            method: "GET",
            headers: {
                "authorization": "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
        });
        console.log(resp,"getEditorData")
        return resp
    } catch (e) {
        console.log(e)
    }
}
export async function syncTopicDrawingData(data,id){
    try {
        data.currentHeading = null
        var resp = await fetch("https://" + url + "/topic/drawing", {
            method: "POST",
            headers: {
                "authorization": "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                id,
                data:data
            })
        });
        console.log(resp)
        return resp
    } catch (e) {
        console.log(e)
    }
}

