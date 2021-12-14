import { CvController } from "./cv-controller.js";

let search = document.querySelector("#search_bar");
let cont = document.querySelector("#cvs");

let catDiv = document.querySelector("#categories");

let cvController = new CvController(search, "http://localhost:5500", cont);

catDiv.childNodes.forEach(btn=>{
    btn.onclick=(ev)=>{
        let term = btn.innerHTML.toLowerCase();
        console.log(term);
        cvController.getByCategory(term);
    }
});