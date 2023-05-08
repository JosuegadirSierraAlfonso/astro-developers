import recruits from "../api/recruits.js";
self.addEventListener("message", (e)=>{
    let res = recruits[`${e.data.type}`]((e.data.arg) ? e.data.arg : undefined);
    Promise.resolve(res).then(res=>postMessage(res));
})