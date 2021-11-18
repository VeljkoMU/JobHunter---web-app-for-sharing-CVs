class CV{
    constructor(name, surname, skills, education, work){
        this.name = name;
        this.surname = surname;
        this.skills = skills;
        this.education = education;
        this.work = work;
    }

    get Name() {return this.name;}
    get Surname() {return this.name;}
    get Skills() {return this.name;}
    get Education() {return this.name;}
    get Work() {return this.name;}

    set Name(value) {this.name = value;}
    set Surname(value) {this.name= value;}
    set Skills(value) {this.name= value;}
    set Education(value) {this.name= value;}
    set Work(value) {this.name= value;}
}

module.exports = CV;