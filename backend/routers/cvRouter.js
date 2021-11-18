const express = require('express');
const { Module } = require('module');
const { User } = require('../models/user');
const redisClient = require("../redis-client");

const cvRouter = express.Router();

cvRouter.get("/category", (req,res)=>{
    let cat = req.query.category;

    redisClient.ping((err, rep)=> res.send(rep));

    // Ovde pretrag cv-eva po kategorijama
    //prvo u redisu, ako nema u redisu onda iz sqla

    // Vrati rezultujucu listu

    res.status(200).end();
});

cvRouter.post("/submit", (req, res)=>{
    let user = new User(req.body.user.username);
    let cv = new Cv(req.body.cv);

    // provera autorizacije (Da li je korisnik loginovan)

    // Ponalazenje korisnika i doadavnje cv-a korisniku

    res.status(200).end();
});

cvRouter.get("/search", (req, res)=>{
    let searchTerm = req.query.term;
     // Pretraga po skillovima cv-eva
    // Za sve pronadjene cv, nadji korinika, vrati listu cv-eva

    //Ako nije pronadjen vrati praznu listu

    res.status(200).end();
});




module.exports = cvRouter;