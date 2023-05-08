let headers = new Headers({"Content-Type": "application/json"});
let port = 4023;

const getRecruit = async()=>{
    let config = {
        method: "GET",
        headers: headers
    };
    return await (await fetch(`http://localhost:${port}/recruits`, config)).json();
}
export default{
    getRecruit
}