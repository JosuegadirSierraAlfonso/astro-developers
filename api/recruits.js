let port = 4023;

const getRecruit = async()=>{
    let config = {
        method: "GET",
        headers: {
            "Content-Type": "aplication/json"
        }
    };
    return await (await fetch(`http://localhost:${port}/recruits`, config)).json();
}
const postRecruit = async(arg)=>{
    arg.id = (arg.id) ? arg.id : Date.now();
    let config = {
        method: "POST", 
        headers: {
            "Content-Type": "aplication/json"
        },
        body:JSON.stringify(arg)
    };
    return await ( await fetch(`http://localhost:${port}/recruits`, config) ).json();
}
export default{
    getRecruit,
    postRecruit
}