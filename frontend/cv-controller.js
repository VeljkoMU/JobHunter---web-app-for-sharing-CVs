import {cv} from "./cv-mode.js";
import { CvView } from "./cv-view.js";

export class CvController{

    constructor(searchInput, url, parent){
        this.cvList = [];
        this.url = url;
        this.timeout=null;
        this.parent = parent;
        this.view = new CvView(this.parent, this.cvList);
        this.initSearchListener(searchInput);
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


    addCv(cv){
        this.cvList.push(cv);
    }
}