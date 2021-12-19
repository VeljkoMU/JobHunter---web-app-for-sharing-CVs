import {cv} from "./cv-mode.js";
import { CvView } from "./cv-view.js";

export class CvController{

    constructor(searchInput, url, parent){
        if(parent!=null){
        this.cvList = [];
        this.url = url;
        this.timeout=null;
        this.parent = parent;
        this.view = new CvView(this.parent, this.cvList);
        this.initSearchListener(searchInput);
        this.userCv = null;
        }
    }

    initSearchListener(input){
        input.addEventListener('input', this.getSearchFromInput.bind(this));
    }
    getSearchFromInput(e){
        clearTimeout(this.timeout);
        this.timeout = setTimeout(()=>{
            this.cvList = [];
            let term = e.target.value;
            fetch("http://localhost:5500/search?term="+term)
            .then(val=>val.json())
            .then(data =>{
                console.log(data);
                this.cvList=[];
                data.forEach(c=> this.cvList.push(new cv(c.name, c.surname, c.phone_number, c.email, c.biography, c.education, c.employment_history, c.category)));
                console.log(this.cvList);
                console.log(this);
                this.view.Cvs = this.cvList;
                this.view.update();
            })
            .catch(err=> this.view.clear());
        }, 3000);
    }

    getByCategory(category){
        this.cvList = [];
        fetch(`${this.url}/category?category=${category}`)
        .then(val => {
            console.log(val);
           return val.json()
        })
        .then(data=>{
            console.log(data);
            this.cvList=[];
            data.forEach(c=> this.addCv(new cv(c.name, c.surname, c.phone_number, c.email, c.biography, c.education, c.employment_history, c.category)));
            console.log(this.cvList);
            this.view.Cvs=this.cvList;
            this.view.update();
        })
        .catch(err=>this.view.clear());
    }

    registerUserAndCreateCv(userData,cv){
        fetch(`http://localhost:5500/users/register`, {
            method: "POST",
            credentials: "include",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: userData.username,
                password: userData.password
            })
        })
        .then(()=>{
            fetch(`http://localhost:5500/submit`, {
                method: "PUT",
                credentials: "include",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: cv.name,
                    surname: cv.surname,
                    num: cv.num,
                    email: cv.email,
                    bio: cv.bio,
                    education: cv.edu,
                    work: cv.work,
                    category: cv.category,
                    skills: []
                })
            })
            .then(()=>{
                cv.skills.forEach(s=>{
                    fetch(`http://localhost:5500/skill`, {
                        method: "POST",
                        credentials: "include",
                        mode: "cors",
                        headers: {
                            "Conent-Type": "application/json"
                        },
                        body: JSON.stringify(
                            {
                                skill: s
                            }
                        )
                    }).catch((err)=>{
                        console.log(err);
                        alert("Greska u registrciji!");
                    })
                })
            }).catch((err)=>{
                console.log(err);
                alert("Greska u registrciji!");
            })
        }).catch((err)=>{
            console.log(err);
            alert("Greska u registrciji!");
        })
    }

    updateCv(cv){
        fetch("http://localhost:5500/submit", {
            method: "PUT",
            credentials: "include",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: cv.name,
                surname: cv.surname,
                num: cv.num,
                email: cv.email,
                bio: cv.bio,
                education: cv.edu,
                work: cv.work
            })
        }).then(()=>alert("Your cv has been updated!"));
    }

    addSkill(sk){
        fetch("http://localhost:5500/skill", {
            method: "POST",
            credentials: "include",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                skill: sk
            })
        });
    }

    addCv(cv){
        this.cvList.push(cv);
    }

    async getUsersCv(){
        return fetch("http://localhost:5500/getCv", {
            method: "GET",
            credentials: "include",
            mode: "cors"
        })
        .then(val=>{val.json();
            console.log(val);
        })
        .then(data=> this.userCv=new cv(data.name, data.surname, data.phone_number, data.email, data.biography, data.education, data.employment_history, data.category))
        .catch(err=>alert(err));
    }
}

//dodaj validaciju
//otvaranje stranice druge
//resi dodavanej skillova glupih