import { CvController } from "./cv-controller.js";
import { cv } from "./cv-mode.js";


let cvController = new CvController(null, "http://localhost:5500", null);
let submitBtn = document.querySelector("#submit-cv");

submitBtn.onclick = (ev)=>{
    console.log("tu sam!");
    let nameinput = document.querySelector("#name");
    let surnameinput = document.querySelector("#surname");
    let num = document.querySelector("#num");
    let work = document.querySelector("#work");
    let edu = document.querySelector("#edu");
    let email = document.querySelector("#email");
    let bio = document.querySelector("#bio");
    let category = document.querySelector("#category");
    let skills = document.querySelector("#skills");    
    let usernamei = document.querySelector("#username");
    let passwordi = document.querySelector("#password");
    let userData = {
        username : usernamei.value,
        password: passwordi.value
    }

    let CV = new cv(nameinput.value, surnameinput.value, num.value, email.value, bio.value, edu.value, work.value, category.value);
    let skillsArray = skills.value.split(',');
    skillsArray.forEach(s => {
        CV.addSkill(s);
    });
    cvController.registerUserAndCreateCv(userData, CV);
};
