let pathName = new URL(import.meta.url).pathname;
let name = pathName.split("/").pop().replace(".js","");


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
        let ws2 = new Worker("../config/wsRecruits.js", {type: "module"});
        let ws3 = new Worker("../config/wsRecruits.js", {type: "module"});

        let data = Object.fromEntries(new FormData(e.target))
        
        switch (e.submitter.dataset.valor) {
            case "post":
                ws.postMessage({type: "postRecruit", arg: data});
                break;
            case "get":
                ws.postMessage({type: "getRecruit"});
                break;
            case "getOld":
                ws2.postMessage({type: "getRecruit"});
                break;
            case "obtain":
                ws3.postMessage({type: "getRecruit"});
                break;
            default:
                break;
        }
        ws.addEventListener("message", (e)=>{
            console.log(e.data);
            this.displayDataInTable(e.data);
            ws.terminate();
        })
        ws2.addEventListener("message", (e)=>{
            console.log(e.data);
            this.obtainOld(e.data);
            ws.terminate();
        })
        ws3.addEventListener("message", (e)=>{
            console.log(e.data);
            this.obtainMinors(e.data);
            ws.terminate();
        })
        
        
    }

    async obtainMinors(data) {
        try {
          const tableBody = this.shadowRoot.querySelector("#resul");
          if (!Array.isArray(data)) {
            throw new Error(
              "Datos inválidos proporcionados. Se esperaba un array."
            );
          }
          const sortedData = data.sort((a, b) => a.id - b.id);
          let plantilla = "";
          
          sortedData.forEach((user) => { 
             if (user.age < 18){
              plantilla += `
                <tr>
                    <th>${user.id}</th>
                    <th>${user.name}</th>
                    <th>${user.age}</th>
                    <th>${user.phone}</th>
                    <th>${user.email}</th>
                    <th>${user.address}</th>
                    <th>${user.birthdate}</th>
                    <th>${user.identification_number}</th>
                    <th>${user.admission_date}</th>
                    <th>${user.teamId}</th>
                </tr>   
                      
              `;
             }
          }) 
          tableBody.innerHTML = plantilla;
        } catch (error) {
          console.log(error);
        }
    }

    async obtainOld(data) {
        try {
          const tableBodyy = this.shadowRoot.querySelector("#resul");
          if (!Array.isArray(data)) {
            throw new Error(
              "Se esperaba un array."
            );
          }
          const sortedData = data.sort((a, b) => a.id - b.id);
          let plantillaa = "";
          
          sortedData.forEach((user) => {
            
            const fecha = new Date('08/03/2023');
            const comprobante = fecha.toLocaleDateString();
    
            const admission_date = new Date(user.admission_date)
            
            const comp = admission_date.toLocaleDateString();
            console.log(comprobante);
            if ((comp <= comprobante && user.admission_date)){
    
              plantillaa += `
                <tr>
                    <th>${user.id}</th>
                    <th>${user.name}</th>
                    <th>${user.age}</th>
                    <th>${user.phone}</th>
                    <th>${user.email}</th>
                    <th>${user.address}</th>
                    <th>${user.birthdate}</th>
                    <th>${user.identification_number}</th>
                    <th>${user.admission_date}</th>
                    <th>${user.teamId}</th>
                </tr>  
              `;
            }
          }) 
          tableBodyy.innerHTML = plantillaa;
        } catch (error) {
          console.log(error);
        }
    }


    async displayDataInTable(data) {
        try {
          const tableBody = this.shadowRoot.querySelector("#resul");
          if (!Array.isArray(data)) {
            throw new Error(
              "Datos inválidos proporcionados. Se esperaba un array."
            );
          }
          const sortedData = data.sort((a, b) => a.id - b.id);
          let plantilla = "";
          
          sortedData.forEach((user) => {
              plantilla += `
                <tr>
                    <th>${user.id}</th>
                    <th>${user.name}</th>
                    <th>${user.age}</th>
                    <th>${user.phone}</th>
                    <th>${user.email}</th>
                    <th>${user.address}</th>
                    <th>${user.birthdate}</th>
                    <th>${user.identification_number}</th>
                    <th>${user.admission_date}</th>
                    <th>${user.teamId}</th>
                </tr>  
              `;

          }) 
          tableBody.innerHTML = plantilla;
        } catch (error) {
          console.log(error);
        }
    }


    static get observedAttributes(){
        return ['data-accion'];
    }
     attributeChangedCallback(name,old,now){
        console.log(name,old,now);
        console.log(this.dataset.accion);
    }
    connectedCallback(){
        Promise.resolve(myHeader.components()).then(html=>{
            this.shadowRoot.innerHTML = html;
            this.MyHead = this.shadowRoot.querySelector("#formu")
            this.MyHead.addEventListener("submit", this.handleEvent.bind(this))
        })
    }
}
customElements.define(name, myHeader)