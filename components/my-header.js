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

        let data = Object.fromEntries(new FormData(e.target))
        
        switch (e.submitter.dataset.valor) {
            case "get":
                ws.postMessage({type: "getRecruit"});
                break;
            case "post":
                ws.postMessage({type: "postRecruit", arg: data});
                break;
            default:
                break;
        }
        ws.addEventListener("message", (e)=>{
            console.log(e.data);
            this.displayDataInTable(e.data);
            ws.terminate();
        })
        
        
    }


    async displayDataInTable(data) {
        try {
          const tableBody = this.shadowRoot.querySelector("#resul");
          /* console.log("display: ", this.shadowRoot); */
          if (!Array.isArray(data)) {
            throw new Error(
              "Datos inválidos proporcionados. Se esperaba un array."
            );
          }
          const sortedData = data.sort((a, b) => a.id - b.id);
          let plantilla = "";
          
          sortedData.forEach((user) => {
            
            /* const fecha = new Date('2023/03/8');
            const comprobante = fecha.toLocaleDateString();
    
            const fechaIngreso = new Date(user.fechaIngreso)
            
            const comp = fechaIngreso.toLocaleDateString();
            console.log(comprobante); */
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