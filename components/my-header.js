let pathName = new URL(import.meta.url).pathname;
let name = pathName.split("/").pop().replace(".js","");

let tab = document.querySelector(".tab")
export default class myHeader extends HTMLElement{
    static async components(){

        return await ( await fetch(pathName.replace(".js", ".html"))).text();
    }
    constructor(){
        super();
        this.attachShadow({ mode: "open" });
        
    }

    handleEvent(e){
        (e.type === "submit") ? this.myworker(e)
        : undefined;
    }

    myworker(e){
        e.preventDefault();
        let ws = new Worker("../config/wsRecruits.js", {type: "module"});
        
        let data = Object.fromEntries(new FormData(e.target));
        switch (e.submitter.dataset.valor) {
            case "get":
                ws.postMessage({type: "getRecruit"});
                ws.onclick = () =>{
                    tab.style.display ="none"
                }
                break;
            case "post":
                ws.postMessage({type: "postRecruit", arg: data});
                break;
            default:
                break;
        }
        ws.addEventListener("message", (e)=>{
            console.log(e.data);
            ws.terminate();
        })
        
        
    }
/*     static get observedAttributes(){
        return ['data-accion'];
    } */
    /* attributeChangedCallback(name,old,now){
        console.log(name,old,now);
        console.log(this.dataset.accion);
    } */
    connectedCallback(){
        Promise.resolve(myHeader.components()).then(html=>{
            this.shadowRoot.innerHTML = html;
            this.MyHead = this.shadowRoot.querySelector("#formu")
            this.MyHead.addEventListener("submit", this.handleEvent.bind(this))
        })
    }
}
customElements.define(name, myHeader)