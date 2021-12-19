export class cv{
    constructor(name,surname, num, email, bio, edu, work, category){
        this.name =name;
        this.surname = surname;
        this.num = num;
        this.email = email;
        this.bio = bio;
        this.edu = edu;
        this.work = work;
        this.category = category;
        this.skills = [];
    }

    addSkill(skill){
        this.skills.push(skill);
    }
}