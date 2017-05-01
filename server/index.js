//IMPORT ALL OUR NODE MODULES
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mysql = require("mysql");

//IMPORT EXPRESS
var app = express();

//SET UP OUR PATH VARIABLES FOR EASE-OF-ACCESS
var clientPath = path.join(__dirname, "../client");
// var jsonPath = path.join(__dirname, "data.json");

//SET UP OUR STATIC FILE-SERVING
app.use(express.static(clientPath));
//SET UP OUR BODY-PARSER FOR INCOMING JSON
app.use(bodyParser.json());


var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "carltonbanks",
    password: "Romans831",
    database: "Chirper"
});

function sendQuery(procedure, values) {
    return new Promise(function(fulfill, reject) {
        //WE CONNECT TO THE POOL THAT WE'VE CREATED ABOVE
        pool.getConnection(function (err, connection) {
            //IF THERE'S AN ERROR CONNECTING, REJECT OUR PROMISE WITH THAT ERROR
            if (err) {
                reject(err);
                //OTHERWISE...
            } else {
                var queryString;
                switch (procedure) {
                    case "GET_ALL":
                        queryString = "CALL GetAllChirps()";
                        break;
                    case "GET_SINGLE":
                        queryString = "CALL getSingleChirp(?)";
                        break;
                    case "INSERT":
                        queryString = "CALL InsertChirp(?, ?)";
                        break;
                    case "UPDATE":
                        queryString = "CALL UpdateChirp(?, ?)";
                        break;
                    case "DELETE":
                        queryString = "CALL DeleteChirp(?)";
                        break;
                    case "GET_USERS":
                        queryString = "SELECT * FROM Users";
                        break;
                }
                connection.query(queryString, values, function (err, resultSets) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        fulfill(resultSets);
                    }
                })
            }
        });
    });
}

//SET UP A ROUTE FOR /CHIRPS/*/UPDATE
app.route("/chirps/*/update")
    .get(function(req, res) {
        res.sendFile(path.join(clientPath, "views/single_update.html"));
    })

//SET UP A ROUTE FOR /CHIRPS/*
app.route("/chirps/*")
    .get(function(req, res) {
        res.sendFile(path.join(clientPath, "views/single_view.html"));
    })

//SET UP A ROUTE FOR /CHIRPS
app.route("/chirps")
    .get(function(req, res) {
        res.sendFile(path.join(clientPath, "views/list.html"));
        //Users/clayanderson/documents/Project1-Solution/client/views/list.html
    })    

//SET UP OUR ROUTE FOR /API/CHIRPS
app.route("/api/chirps")
//IF SOMEONE IS SENDING A 'GET' REQUEST TO OUR ROUTE
    .get(function (req, res) {
        sendQuery("GET_ALL", []).then(function(data) {
            res.send(data[0]);
        }, function(err) {
            console.log(err);
            res.sendStatus(500);
        })
    })
    //OTHERWISE, IF SOMEONE IS SENDING A 'POST' REQUEST TO OUR ROUTE
    .post(function (req, res) {
        sendQuery("INSERT", [req.body.message, req.body.userId]).then(function(data) {
            res.status(201).send(data[0]);
        }, function(err) {
            console.log(err);
            res.sendStatus(500);
        })
    });

//SET UP OUR ROUTE FOR USERS
app.route('/api/users')
    .get(function(req, res) {
        sendQuery("GET_USERS", []).then(function(data) {
            res.send(data);
        }, function(err) {
            console.log(err);
            res.sendStatus(500);
        })
    });

//SET UP OUR ROUTE FOR AN INDIVIDUAL CHIRP
app.route("/api/chirps/:id")
    .get(function(req, res) {
        sendQuery("GET_SINGLE", [req.params.id]).then(function(data) {
            console.log(data);
            res.send(data[0]);
        }, function(err) {
            console.log(err);
            res.sendStatus(500);
        })
    })
    .put(function(req, res) {
        sendQuery("UPDATE", [req.params.id, req.body.message]).then(function(data) {
            res.sendStatus(204);
        }, function(err) {
            console.log(err);
            res.sendStatus(500);
        })
    })
    .delete(function(req, res) {
        sendQuery("DELETE", [req.params.id]).then(function() {
            res.sendStatus(204);
        }, function(err) {
            console.log(err);
            res.sendStatus(500);
        })
    });

//LISTEN ON PORT 3000
app.listen(3000);