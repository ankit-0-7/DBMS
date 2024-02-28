// const mysql = require("mysql");
// const express = require("express");
// const bodyParser = require("body-parser");
// const encoder = bodyParser.urlencoded();


// const app = express();
// var publicDir = require('path').join(__dirname,'/');
// app.use(express.static(publicDir));
// app.use("/assets",express.static("assets"));

// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "nodejs"
// });

// // connect to the database
// connection.connect(function(error){
//     if (error) throw error
//     else console.log("connected to the database successfully!")
// });


// app.get("/",function(req,res){
//     res.sendFile(__dirname + "/demo/login.html");
// })

// app.get("/register.html",function(req,res){
//     res.sendFile(__dirname + "/demo/register.html");
// })

// app.post("/",encoder, function(req,res){
//     var username = req.body.username;
//     var password = req.body.password;

//     connection.query("select * from loginuser where user_name = ? and user_pass = ?",[username,password],function(error,results,fields){
//         if (results.length > 0) {
//             res.redirect("/demo/index");
//         } else {
//             console.log("wrong password");
//             res.redirect("/");
//         }
//         res.end();
//     })
// })

// // when login is success
// app.get("/demo/index",function(req,res){
//     res.sendFile(__dirname + "/demo/index.html")
// })

// // app.post('/reg',function(req,res){
// //     const f_name = req.body.f_name;
// //     const lname = req.body.l_name;
// //     const pass= req.body.password;
// //     const username=req.body.username;
// //     const phone=req.body.phoneNo;

// //     connection.query("INSERT INTO cutomer(`user_name`, `f_name`, `l_name`, `phone_no`,`password`) VALUES ('?','?','?','?','?')",[username,f_name,lname,phone,pass],function(error,results,fields){
// //         if (results.length > 0) {
// //             res.redirect("/");
// //         } else {
// //             console.log("wrong password");
// //             res.redirect("/");
// //         }
// //         res.end();})
// // })

// app.post('/reg', function (req, res) {
//     const f_name = req.body.f_name;
//     const lname = req.body.l_name;
//     const pass = req.body.password;
//     const username = req.body.username;
//     const phone = req.body.phoneNo;

//     connection.query("INSERT INTO cutomer(`user_name`, `f_name`, `l_name`, `phone_no`,`password`) VALUES (?,?,?,?,?)",
//         [username, f_name, lname, phone, pass],
//         function (error, results, fields) {
//             if (error) {
//                 console.log("Error inserting record:", error);
//                 res.redirect("/");
//             } else {
//                 console.log("Record inserted successfully!");
//                 res.redirect("/");
//             }
//             res.end();
//         });
// });



// //register part



// // set app port 
// app.listen(4000);

const mysql = require("mysql");
const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
// const encoder = bodyParser.urlencoded();
// const encoder = bodyParser.urlencoded({ extended: true });
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
// app.set("view engine", "ejs"); // Set EJS as the view engine
const encoder = bodyParser.urlencoded({ extended: true });
app.use(express.json());



var publicDir = require('path').join(__dirname,'/');
app.use(express.static(publicDir));
app.use("/assets", express.static("assets"));
// app.use(express.json);
// app.use(express.urlencoded( {extended : true }));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs"
});

// connect to the database
connection.connect(function (error) {
    if (error) throw error;
    else console.log("connected to the database successfully!");
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/demo/login.html");
});

app.get("/register.html", function (req, res) {
    res.sendFile(__dirname + "/demo/register.html");
});

app.post("/", encoder, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from cutomer where user_name = ? and password = ?", [username, password], function (error, results, fields) {
        if (results.length > 0) {
            res.redirect("/demo/index");
        } else {
            console.log("wrong password");
            res.redirect("/");
        }
        res.end();
    });
});

// when login is success
app.get("/demo/index", function (req, res) {
    res.sendFile(__dirname + "/demo/index.html");
});

app.post('/reg', function (req, res) {
    const f_name = req.body.first_name;
    const lname = req.body.last_name;
    const pass = req.body.password;
    const username = req.body.username;
    const phone = req.body.phonenumber;

    connection.query("INSERT INTO cutomer(`user_name`, `f_name`, `l_name`, `phone_no`,`password`) VALUES (?,?,?,?,?);",
        [username, f_name, lname, phone, pass],
        function (error, results, fields) {
            if (error) {
                console.log("Error inserting record:", error);
                res.redirect("/");
            } else {
                console.log("Record inserted successfully!");
                res.redirect("/");
            }
            res.end();
        });
});

app.get('/getCartdata', async (req, res) => {
    const { username } = req.query;

    try {
        connection.query("SELECT C.ART_ID,A.PRICE,A.TITLE FROM CART C,ART A WHERE c.USER_NAME=? AND C.ART_ID=A.ART_ID;",
        [username],
        function (error, results, fields) {
            if (error) {
                console.log("Error inserting record:", error);
                return res.status(404).json({done:false});
            } else {
                return res.status(200).json({cart:results,done:true});
            }
            res.end();
        });
        // return res.json({ cartData :true});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    // Add this to your login endpoint
// res.cookie('user', username, { maxAge: 3600000 }); // Set cookie to expire in 1 hour

});

app.get('/getAllItems',async(req,res)=>{
    try {
        connection.query("SELECT * FROM art;",
        function (error, results, fields) {
            if (error) {
                console.log("Error inserting record:", error);
                return res.status(404).json({done:false});
            } else {
                console.log("Record retrived successfully!");
                return res.status(200).json({art:results,done:true});
            }
        });
    } catch (error) {
        
    }
})

app.post('/addToCart',function(req,res){
    const username = req.body.username
    const art_id = req.body.art_id
    console.log(username)
    connection.query("INSERT INTO cart (`user_name`, `art_id`) VALUES (?,?);",
        [username, art_id],
        function (error, results, fields) {
            if (error) {
                console.log("Error inserting record:", error);
                res.json({done:false})
            } else {
                console.log("Record inserted successfully!");
                res.json({done:true})
            }
            res.end();
    });
})

app.delete('/removeCartItem',async(req,res)=>{
    const username = req.body.username
    const art_id = req.body.art_id
    console.log(username)
    console.log(art_id)
    connection.query("DELETE FROM CART WHERE `user_name`=? AND `art_id`=?;",
        [username, art_id],
        function (error, results, fields) {
            if (error) {
                console.log("Error inserting record:", error);
                res.json({done:false})
            } else {
                console.log("Record deleted successfully!");
                res.json({done:true})
            }
            res.end();
    });
})

app.post('/contactForm',async(req,res)=>{
    const username = req.body.username;
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    console.log(username)
    console.log(message)
    connection.query("INSERT INTO CONTACT VALUES(?,?,?,?);",
        [username,name,email, message],
        function (error, results, fields) {
            if (error) {
                console.log("Error inserting record:", error);
                res.json({done:false})
            } else {
                console.log("Record deleted successfully!");
                res.json({done:true})
            }
            res.end();
    });
})

// set app port 
app.listen(4000);
