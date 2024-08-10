// @ts-nocheck
const url = "api.venkatrohit.com"

export async function getEditorData(id) {
    try {
        var resp = await fetch("https://" + url + "/topic/editor?id="+id, {
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
export async function syncTopicEditorData(data,id){
    try {
        data.currentHeading = null
        var resp = await fetch("https://" + url + "/topic/editor", {
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

