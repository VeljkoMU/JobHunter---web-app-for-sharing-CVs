let uname = document.querySelector("#username");
let pass = document.querySelector("#password");
let btn = document.querySelector("#loginbtn");


let url = "http://localhost:5500";
btn.onclick = (ev)=>{
    let username = uname.value;
    let password = pass.value;

    fetch(`${url}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }).then(res=>{
        if(res.ok){
            //otvori novu stranicu
            alert("Radi!");
        }
    })
    .catch(err=>console.log(err));
}