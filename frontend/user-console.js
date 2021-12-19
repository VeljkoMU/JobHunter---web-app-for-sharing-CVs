import { CvController } from "./cv-controller.js";
import { cv } from "./cv-mode.js";


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

let updateBtn = document.querySelector("#submit-cv");

updateBtn.onclick = (ev)=>{
    cvController.updateCv(new cv(nameinput.value, surnameinput.value, num.value, email.value, bio.value, edu.value, work.value, null))
};

let skillsDiv = document.querySelector(".skill-view");

cvController.getAllUsersSkills()
.then(val=>val.json())
.then(d=>{
    //console.log(d);
    d.forEach(skil=>{
        let sdiv = document.createElement('div');
        sdiv.classList.add("skill");
        sdiv.innerHTML = skil.name;
        skillsDiv.appendChild(sdiv);
    });
})

let skillInput = document.querySelector("#skill-input");
let skillAddBtn = document.querySelector("#skill-submit-btn");

skillInput.addEventListener('input', (ev)=>{
    if(skillInput.value.length!=0)
        skillAddBtn.disabled = false;
    else
        skillAddBtn.disabled = true;
});

skillAddBtn.onclick = (ev)=>{
    cvController.addSkill(skillInput.value)
    .then(res=>{
        if(res.OK){
            let sdiv = document.createElement('div');
            sdiv.classList.add("skill");
            sdiv.innerHTML = skillInput.value;
            skillsDiv.appendChild(sdiv);
        }
    })
};
});

//zavrsi ovo vise!