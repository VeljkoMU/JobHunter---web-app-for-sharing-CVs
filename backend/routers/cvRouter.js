const express = require('express');
const { Module } = require('module');
const { getEnvironmentData } = require('worker_threads');
const { User } = require('../models/user');
const redisClient = require("../redis-client");
const sql = require("../mysql");

const cvRouter = express.Router();

cvRouter.get("/category", async (req,res)=>{
    let cat = req.query.category;
    if(!validateSearch(cat)){
        res.status(403).end();
        return;
    }
    sqlQuery = `
    SELECT cv.name, cv.surname, cv.biography, cv.education, cv.employment_history, cv.email, cv.phone_number 
    FROM CV JOIN category ON category.ID
    WHERE category.NAME = "${cat}";  
    `;

    await getDataArray(`category:${cat}`, sqlQuery)
    .then(val => val.json())
    .then(data =>{
        res.json(data).end();
        return;
    })
    .catch(err=>{
        console.log("error: " + err);
        res.status(500).end();
        return;
    });

});

cvRouter.put("/submit", async (req, res)=>{

    let existringCv=undefined;
    // Validacija cv-a, treba da se doda


    // Proverava da li je korisnik loginovan
    if(!req.session.authorized){
        res.status(401).end()
        return;
    }

    // Provera da li dati user vec ima cv
    await sql.query(`select cv.id from cv join user on cv.id where username= ${req.session.user}`, (err, rows, fileds)=>{
        if(rows.length!=0)
            existringCv = rows[0];
    });

    // Ako ima, updatujemo ga 
    if(existringCv){
        sqlUpdateQuery = `
            update cv set
            name= ${req.body.name},
            surname = ${req.body.surname},
            biography = ${req.body.bio},
            education = ${req.body.education},
            employment_history = ${req.body.work},
            email = ${req.body.email},
            phone_number = ${req.body.num}
            where cv.id = ${existringCv};
        `;

        mysql.query(sqlUpdateQuery);
        // Vidi sta ces za dodavanje skillova
    }
    else{
        // Ako nema pravimo novi
        let categoryId = null;
        sqlInsertIntoQuery = `
            insert into cv  (name, surname, biography, education, employment_history, email, phone_number, category)
            values (${req.body.name}, ${req.body.surname}, ${req.body.bio}, ${req.body.education}, ${req.body.work}, ${req.body.email}, ${req.body.num}, ${categoryId});
        `;

        sqlGetCategoryId = `
            select category.id from category where category.name = ${req.body.category};
        `;
        let createCvId = null;

        // Provedi da li kategorija postoji i ako postoji dodaj je u cv
        await sql.query(sqlGetCategoryId, (err, result, f)=>{
            if(err){
                console.log(err);
                res.status(500).end();
                return;
            }

            if(result.length===0){
                res.status(404).end();
                return;
            }

            categoryId = result[0];
        });

        // Dodaj cv u bazu i zapamti njegov id
        await sql.query(sqlInsertIntoQuery, (err, result, f)=>{
            if(err){
                console.log(err);
                res.status(500).end();
                return;
            }

            createCvId = result.insertId;
        });

        // Funkcija koja dodaje skillove cv-u, ako postoje samo doaj u has_skill, ako ne postoje dodaj novi skill i povezi ga za cv
        await addSkillsToCv(req.body.skills, createCvId, res);

        res.status(200).end();
    }
});

cvRouter.get("/search", async (req, res)=>{
    let searchTerm = req.query.term;
    if(!validateSearch(searchTerm)){
        res.status(403).end()
        return;
    }

    sqlQuery = `
    select * from (cv inner join has_skill
        on cv.id = has_skill.cv) inner join skill
        on has_skill.skill = skill.id
        where skill.name = ${searchTerm}
    `;
    await getDataArray(`skill:${searchTerm}`, SQLQuery)
    .then(val=>val.json())
    .then(data=>{
        res.json(data).end();
        return;
    })
    .catch(err=>{
        console.log("Error :" + err);
        res.status(500).end();
    });

});

async function getDataArray(redisKey, SQLQuery){
    // Uzima podatak iz redisa ili ako ga nema u redisu uzima iz sql-a i upisuje u redis
    return new Promise(async (resolve, reject)=>{
        await redisClient.lrange(redisKey, 0, -1, async (err, reply)=>{
            if(err)
                reject(err);
            
            data=[];
            if(reply.length === 0){
                await sql.query(SQLQuery, (err, rows, fileds)=>{
                    if(err)
                        reject(err);
                    console.log(rows);
                    rows.forEach(row=> {
                        data.push(JSON.stringify(row));
                    });
                    redisClient.lpush(redisKey, JSON.stringify(data));
                    redisClient.expire(redisKey, 60 * 5);
                    console.log("Cache-miss for " + redisKey);
                });

                return resolve(data);
            }
            data = reply;
            console.log("Cahche-hit for " + redisKey);
            return resolve(data);
        });
    });
}

function validateSearch(searchTerm){
    console.log(searchTerm);
    if(/[a-zA-Z]+/.test(searchTerm))
        return true
    else return false
}

async function addSkillsToCv(skills, cvId, res){
    // Sara proveri ovu funkciju, nzm dal je dobar sql :(
    let skill = null;
    let skillId = null;
    sqlGetSkillId = `
        select skill.id from skill where skill.name = ${skill};
    `;
    sqlInsertSkill = `
        insert into skill (name)
        values (${skill});
    `;
    sqlLinkSkillToCv = `
        insert into has_skill (cv, skill)
        values (${cvId}, ${skillId});
    `;

    skills.forEach((s)=>{
        skill = s;

        await sql.query(sqlGetSkillId, (err, result, f)=>{
            if(err){
                console.log(err);
                res.status(500).end();
                return;
            }

            if(result.length===0){
                await  sql.query(sqlInsertSkill, (err, resultSkill, f)=>{
                    if(err){
                        console.log(err);
                        res.status(500).end();
                        return;
                    }

                    skillId = resultSkill.resultId;
                });
            }
            else{
                skillId = resultSkill[0];
            }

           await sql.query(sqlLinkSkillToCv);
        });
    });
}

// treba da dodamo u ovaj fajl:
// Funkciju za dodavanje i brisanje skilova u vec postojeci cv
// Validaciju podataka iz bodija za sve
// Da testiramo sve ovo jer meni ne radi sql



module.exports = cvRouter;