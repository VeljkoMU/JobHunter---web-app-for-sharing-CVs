const { Module } = require("module");

class User{
    constructor(username){
        this.username = username;
        this.password;
        this.cv;
    }

    get Username(){
        return this.username;
    }

    get Password(){
        return this.password;
    }

    set Username(value){
        this.username = value;
    }

    set Password(value){
        this.password = value;
    }
}

module.exports = User;