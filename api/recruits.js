let port = 4023;

const getRecruit = async()=>{
    let config = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    return await (await fetch(`http://localhost:${port}/recruits`, config)).json();
}
const postRecruit = async(arg)=>{
    arg.id = (arg.id) ? arg.id : Date.now();
    let config = {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(arg)
    };
    const res= await ( await fetch(`http://localhost:${port}/recruits`, config) ).json();
    console.log(res);
}
export default{
    getRecruit,
    postRecruit
}