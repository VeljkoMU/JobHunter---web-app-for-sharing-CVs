import { CvController } from "./cv-controller.js";


let cvController = new CvController(null, "http://localhost:5500/submit", null);
console.log("tu saM!");
cvController.getUsersCv().then(()=>{

let nameinput = document.querySelector("#name");
let surnameinput = document.querySelector("#surname");
let num = document.querySelector("#num");
let work = document.querySelector("#work");
let edu = document.querySelector("#edu");
let email = document.querySelector("#email");
let bio = document.querySelector("#bio");

nameinput.value = cvController.userCv.name;
surnameinput.value = cvController.userCv.surname;
num.value = cvController.userCv.num;
work.value=cvController.userCv.work;
edu.value = cvController.userCv.edu;
email.value = cvController.userCv.email;
bio.value = cvController.userCv.bio;

});

//zavrsi ovo vise!