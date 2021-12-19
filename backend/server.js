const express = require('express');
const redisClient = require('./redis-client');
const mysql = require('./mysql.js');
const { rootCertificates } = require('tls');
const userRouter = require("./routers/userRouter");
const cvRouter = require("./routers/cvRouter");
const { REPL_MODE_SLOPPY } = require('repl');
const session = require('express-session');
const connectRedis = require('connect-redis');
const md5 = require('md5');
const cors = require('cors');

const RedisSessionStore = connectRedis(session);

const app = express();
app.set("trust proxy", 1);
// Provera dal je povezan na bazu
redisClient.ping((err, rep)=> console.log(rep));
mysql.ping((err)=>console.log("Connected to the MySQL database"));

// Ignorisi ovo
app.use(express.json());

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}));
app.disable('etag');

// Ovo je za session, objasnicu vam sta kako
app.use(session({
    store: new RedisSessionStore({client: redisClient}),
    resave: false,
    saveUninitialized: false,
    secret: "prviprojekatizbaza",
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: false
    }
}));


// Ubacivanje rutera, pogledaj folder routers
app.use("/users", userRouter);
app.use("/", cvRouter);


// Pali server
app.listen(5500, ()=>console.log("Listening on port: " + 5500));



// Popravi dodavanj niza skillova
//Dodaj logout kada se obrise account
//Dodaj URL koji ces da gadajs za pribavljanje liste skillova