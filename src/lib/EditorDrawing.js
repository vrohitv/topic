import {v4 as uuidv4} from "uuid"
export class Drawing{
    constructor({data}){
        // this.data = data
        this.data = {}
        if(this.data == null || this.data == undefined){
            this.data.id = uuidv4()
        }else{
            this.data.id = data.id
        }
        this.data.name = data.name ? data.name : "Note book 1"
    }
    static get toolbox() {
        return {
          title: 'Drawing',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>'
         };
    }
    
    render(){
        const wrapper = document.createElement('div');
        const div = document.createElement('div');
        div.contentEditable = true
        div.placeholder = 'Paste an image URL...';
        div.innerHTML = this.data && this.data.name ? this.data.name : '';
        const button = document.createElement("button")
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>'
        button.onclick= (e)=>{
            document.body.dispatchEvent(new CustomEvent("OpenDrawingCanvas",{detail:this.data.id}))
        }
        wrapper.classList.add("editor-drawing-container");
        wrapper.appendChild(div);
        wrapper.appendChild(button);
        return wrapper;
    }
    save(blockContent){
        console.log(blockContent)
        return {
        id: this.data.id,
        name:blockContent.children[0].innerHTML
    }
    }
    
}