const express = require('express');
const session = require('express-session');
const md5 = require('md5');
const { Module } = require('module');
sql = require("../mysql");

const userRouter = express.Router();

userRouter.post("/login", async (req, res)=>{
    let username = req.body.username;
    let password = req.query.password;

    await sql.query(`select * from user where user.username=${username};`, (err, result, f)=>{
        if(err){
            console.log(err);
            res.status(500).end();
            return;
        }

        if(result.length!=0){
            res.status(404).end()
            return;
        }

        if(md5(password)===result[0].passowrd){
            req.session.authorized = true;
            req.session.user = username;
            res.status(200).end()
            return;
        }
        else{
            res.status(401).end();
            return;
        }

    });
});
    // ovde ide login
    //Ako je uspesan, session.authorized = true, session.user = username
    //Kazi frotnendu da je sve uspelo



userRouter.delete("/deleteUser", (req, res)=>{
    //Nadji user-a
    //Nadji cv usera
    //Proveri prava pristupa
    //Obrisi
});

userRouter.post("/register", async (req,res)=>{
    username = req.body.username;
    passowrd = req.body.password;
    user = null;
    await sql.query(`select * from user where user.username=${username};`, (err, result, f)=>{
        if(err){
            console.log(err);
            res.status(500).end();
            return;
        }

        if(result.length!=0){
            res.status(409).end()
            return;
        }
    });

    await sql.query(`insert into user (username, password)
                    values (${username}, ${md5(password)});  
    `);

    res.status(200).end();
});



module.exports = userRouter;

