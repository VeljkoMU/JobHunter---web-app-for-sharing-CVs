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

