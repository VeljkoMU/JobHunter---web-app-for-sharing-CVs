const { ifError } = require('assert');
const express = require('express');
const session = require('express-session');
const md5 = require('md5');
const { Module } = require('module');
sql = require("../mysql");

const userRouter = express.Router();

userRouter.post("/login", async (req, res)=>{
    let username = await req.body.username;
    let password = await req.body.password;
    console.log(username);
    await sql.query(`select * from user where username="${username}";`, (err, result, f)=>{
        if(err){
            console.log(err);
            res.status(500).end();
            return;
        }

        if(result.length==0){
            res.status(404).end()
            return;
        }
        console.log(password);
        console.log(result[0].passowrd);
        console.log(md5(password).toString().slice(0, 19));
        if(md5(password).toString().slice(0, 19)===result[0].password){
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



userRouter.delete("/deleteUser", async (req, res)=>{
    //Nadji user-a
    //Nadji cv usera
    //Proveri prava pristupa
    //Obrisi

    if(!req.session.authorized){
        res.status(401).end();
        return;
    }

    await sql.query(`select * from user where ${req.session.username}`, async (err, results, f)=>{
        if(err){
            console.log(err);
            res.status(500).end();
            return;
        }

        username = results[0].username;
        cvId = results[0].cv;

        await sql.query(`delete from has_skill where cv = ${svId}`);
        await sql.query(`delete from cv where id = ${cvId}`);
        await sql.query(`delete from user where username = ${username}`);

        res.status(200).end();
        return;
    });
    
});

userRouter.post("/register", async (req,res)=>{
    let username = await req.body.username;
    let password = await req.body.password;
    console.log(req.body);
    user = null;
    await sql.query(`select * from user where user.username=${req.body.username};`, (err, result, f)=>{
        if(err)
            return;
        
        if(result.length!=0){
            res.status(409).end()
            return;
        }
    });

    console.log(password);
    await sql.query(`insert into user (username, password)
                    values ("${req.body.username}", "${md5(password).toString().slice(0,19)}");  
    `);

    res.status(200).end();
});



module.exports = userRouter;

