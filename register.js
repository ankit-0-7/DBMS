const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
// const encoder = bodyParser.urlencoded();

const app = express();
var publicDir = require('path').join(__dirname,'/');
app.use(express.static(publicDir));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs"
});

