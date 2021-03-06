const express = require('express');
const { Module } = require('module');
const { getEnvironmentData } = require('worker_threads');
const { User } = require('../models/user');
const redisClient = require("../redis-client");
const sql = require("../mysql");

const cvRouter = express.Router();

cvRouter.get("/category", async (req,res)=>{
    let cat = await req.query.category;
    if(!validateSearch(cat)){
        res.status(403).end();
        return;
    }
    console.log(cat);
    sqlQuery = `
    SELECT cv.name, cv.surname, cv.biography, cv.education, cv.employment_history, cv.email, cv.phone_number 
    FROM CV JOIN category ON category.ID = cv.category
    WHERE category.NAME = "${cat}";  
    `;
    console.log("tu sam!");
    await getDataArray(`category:${cat}`, sqlQuery)
    .then(data =>{
        console.log("Tu sam!");
        console.log(data);
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
    await sql.query(`select cv.id from cv inner join user on cv.id = user.cv where username= "${req.session.user}"`, async (err, rows, fileds)=>{
        console.log(rows);
        if(rows.length!=0)
            existringCv = rows[0].id;
    

    // Ako ima, updatujemo ga 
    if(existringCv){
        sqlUpdateQuery = `
            update cv set
            name= "${req.body.name}",
           surname = "${req.body.surname}",
            biography = "${req.body.bio}",
            education = "${req.body.education}",
            employment_history = "${req.body.work}",
            email = "${req.body.email}",
            phone_number = ${req.body.num}
            where cv.id = ${existringCv};
        `;

        sql.query(sqlUpdateQuery);
        res.status(200).end();
        return;
        // Vidi sta ces za dodavanje skillova
    }
    else{
        // Ako nema pravimo novi
        let categoryId = null;


        sqlGetCategoryId = `
            select category.id from category where category.name = "${req.body.category}";
        `;
        let createCvId = null;

        // Provedi da li kategorija postoji i ako postoji dodaj je u cv
        await sql.query(sqlGetCategoryId, async (err, result, f)=>{
            if(err){
                console.log(err);
                res.status(500).end();
                return;
            }

            if(result.length===0){
                res.status(404).end();
                return;
            }

            categoryId = result[0].id;
            console.log(categoryId);
            sqlInsertIntoQuery = `
            insert into cv  (name, surname, biography, education, employment_history, email, phone_number, category)
            values ("${req.body.name}", "${req.body.surname}", "${req.body.bio}", "${req.body.education}", "${req.body.work}", "${req.body.email}", ${req.body.num}, ${categoryId});
        `;
        await sql.query(sqlInsertIntoQuery, async (err, result, f)=>{
            if(err){
                console.log(err);
                res.status(500).end();
                return;
            }

            createCvId = result.insertId;
           // await addSkillsToCv(req.body.skills, createCvId, res);

            await sql.query(`update user set
                            cv = ${createCvId}
                            where username="${req.session.user}";
                `);
        });
        });

        // Dodaj cv u bazu i zapamti njegov id


        // Funkcija koja dodaje skillove cv-u, ako postoje samo doaj u has_skill, ako ne postoje dodaj novi skill i povezi ga za cv


        res.status(200).end();
    }
});
});

cvRouter.get("/search", async (req, res)=>{
    let searchTerm = req.query.term;
    if(!validateSearch(searchTerm)){
        res.status(403).end()
        return;
    }

    sqlQuery = `
    select cv.name, cv.surname, cv.biography, cv.education, cv.employment_history, cv.email, cv.phone_number from (cv inner join has_skill
        on cv.id = has_skill.cv) inner join skill
        on has_skill.skill = skill.id
        where skill.name = "${searchTerm}";
    `;
    await getDataArray(`skill:${searchTerm}`, sqlQuery)
    .then(data=>{
        res.json(data).end();
        return;
    })
    .catch(err=>{
        console.log("Error :" + err);
        res.status(500).end();
    });

});

cvRouter.get("/getCv", async (req, res)=>{
    if(!req.session.authorized){
        res.status(403).end();
        return;
    }

    console.log(req.session.user);
    await sql.query(`select * from (cv inner join user on user.cv=cv.id) where user.username = "${req.session.user}";`, (err, result, f)=>{
        if(err){
            console.log(err);
            res.status(500).end();
            return;
        }
        console.log(result);
        res.json(result[0]).end();
        return;
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
                        return reject(err);
                    if(rows.length === 0)
                        return reject("Ne postoji");
                    rows.forEach(row=> {
                        data.push(row);
                    });
                    redisClient.lpush(redisKey, JSON.stringify(data));
                    redisClient.expire(redisKey, 60 * 5);
                    console.log("Cache-miss for " + redisKey);

                    return resolve(data);
                });
            }
            else{
            data = JSON.parse(reply);
            console.log("Cahche-hit for " + redisKey);
            return resolve(data);
            }
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




    await skills.forEach( async (s)=>{
        console.log(s);
        skill = s;


    sqlGetSkillId = `
    select skill.id from skill where skill.name = "${skill}";
    `;
        await sql.query(sqlGetSkillId, async (err, result, f)=>{
            if(err){
                console.log(err);
                res.status(500).end();
                return;
            }

            if(result.length===0){
                sqlInsertSkill = `
                insert into skill (name)
                values ("${skill}");
            `;
                await  sql.query(sqlInsertSkill, async (err, resultSkill, f)=>{
                    console.log(sqlInsertSkill);
                    if(err){
                        console.log(err);
                        res.status(500).end();
                        return;
                    }

                    skillId = resultSkill.insertId;
                    console.log(skillId);
                    sqlLinkSkillToCv = `
                    insert into has_skill (cv, skill)
                    values (${cvId}, ${skillId});
                `;
                   await sql.query(sqlLinkSkillToCv);
                });
            }
            else{
                skillId = result[0].id;
                console.log(skillId);
                sqlLinkSkillToCv = `
                insert into has_skill (cv, skill)
                values (${cvId}, ${skillId});
            `;
               await sql.query(sqlLinkSkillToCv);
            }


        });
    });
}

cvRouter.post("/skill", async (req, res)=>{
    let skill = req.body.skill;

    if(req.session.authorized!=true){
        res.status(403).end();
        return;
    }
    console.log(req.session.user);
    await sql.query(`select cv.id from cv inner join user on cv.id = user.cv where user.username = "${req.session.user}"`, async (err, r, f)=>{
        if(err){
            res.status(500).end();
            return;
        }
        console.log(r);
        console.log(skill);
        await addSkillsToCv([req.body.skill], r[0].id, res);
    });

    res.status(200).end();
    return;
});

cvRouter.delete("/skill", async (req, res)=>{
    skill = req.body.skill;

    if(req.session.authorized!=true){
        res.status(403).end();
        return;
    }

    await sql.query(`select cv.id from cv inner join user on cv.id = user.cv where user.username = "${req.session.user}"`, async (err, r, f)=>{
        if(err){
            res.status(500).end();
            return;
        }

        await sql.query(`delete from has_skill where cv = ${r[0].id} and skill = (select id from skill where name= "${skill}");`);
    });

    res.status(200).end();
    return;
});

cvRouter.get("/getSkills", async(req, res)=>{
    let username = req.session.user;

    await sql.query(`select skill.name from ((user 
        inner join cv on
        user.cv = cv.id) inner join has_skill
        on cv.id = has_skill.cv) inner join skill on
        skill.id = has_skill.skill
        where user.username = "${username}";`, (err, result, f)=>{
            if(err){
                console.log(err);
                res.status(500).end();
                return;
            }
            console.log(result);
            res.json(result).end();
        });
});

// Validaciju podataka iz bodija za sve
// Da testiramo sve ovo jer meni ne radi sql



module.exports = cvRouter;