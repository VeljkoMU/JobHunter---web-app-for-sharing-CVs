const express = require('express');
const session = require('express-session');
const { Module } = require('module');

const userRouter = express.Router();

userRouter.post("/login", (req, res)=>{
    let username = req.body.username;
    let password = req.query.password;

    // ovde ide login
    //Ako je uspesan, session.authorized = true, session.cv = cv.id
    //Kazi frotnendu da je sve uspelo

});


userRouter.delete("/deleteUser", (req, res)=>{
    //Nadji user-a
    //Nadji cv usera
    //Proveri prava pristupa
    //Obrisi
});

userRouter.post("/register", (req,res)=>{
    //registarcija
});



module.exports = userRouter;

