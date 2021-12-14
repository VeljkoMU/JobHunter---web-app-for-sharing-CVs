import {cv} from "./cv-mode.js";

export class CvView{
    constructor(parent, cv){
        this.container = document.createElement("div");
        this.container.classList.add("cv");
        this.parent = parent;
        this.cvs =cv;
    }

    draw(cv){
        let container = document.createElement("div");
        container.classList.add("cv");
        let namesurname = document.createElement("div");
        namesurname.classList.add("name-surname");
        let bio = document.createElement("div");
        let edu = document.createElement("div");
        let work = document.createElement("div");
        let email = document.createElement("div");
        let num = document.createElement("div");
        let cat = document.createElement("div");

        bio.innerHTML = cv.bio;
        let name = document.createElement("h1");
        name.innerHTML = cv.name;
        namesurname.appendChild(name);
        let sur = document.createElement("h1");
        sur.innerHTML = cv.surname;
        namesurname.appendChild(sur);
        edu.innerHTML = cv.edu;
        work.innerHTML = cv.work;
        email.innerHTML= cv.email;
        num.innerHTML = cv.num;
        cat.innerHTML = cv.category;

        container.appendChild(cat);
        container.appendChild(namesurname);
        container.appendChild(bio);
        container.appendChild(edu);
        container.appendChild(work);
        container.appendChild(email);
        container.appendChild(num);

        this.parent.appendChild(container);
        this.animate(container);
    }

    animate(cvDiv){
        setTimeout(()=>{
            cvDiv.classList.add("cv-transition");
        },500);
    }

    clear(){
        while(this.parent.children.length!=0)
            this.parent.removeChild(this.parent.firstChild);
    }

    render(){
        console.log(this.cvs);
        this.cvs.forEach(c=>{
            this.draw(c);
        });
    }

    update(){
        console.log(this.cvs);
        this.clear();
        this.render();
    }

    set Cvs(niz){
        this.cvs = niz;
    }
}