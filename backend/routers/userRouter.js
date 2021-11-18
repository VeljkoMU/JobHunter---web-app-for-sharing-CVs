const express = require('express');
const session = require('express-session');
const { Module } = require('module');

const userRouter = express.Router();

userRouter.post("/login", (req, res)=>{
    let username = req.query.username;
    let password = req.query.password;

    // ovde ide login
    //Ako je uspesan, session.authorized = true, session.cv = cv.id
    //Kazi frotnendu da je sve uspelo
});

userRouter.get("/editCV", (req, res)=>{
    //nadji cv, proveri prava pristupa
    //Promeni cv
});

userRouter.delete("/deleteUser", (req, res)=>{
    //Nadji user-a
    //Nadji cv usera
    //Proveri prava pristupa
    //Obrisi
});


module.exports = userRouter;

