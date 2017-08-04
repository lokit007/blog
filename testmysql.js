let express = require("express");
let mysql = require("mysql");
let configData = require("./configs/connection-data.js");
let pool = mysql.createPool(configData.dataonline);
let app = express();
let Db = require("./models/database.js");

app.listen(3000, function(){
    console.log("Server : http://localhost:%d", 3000);
});

app.get("/data", function(req, res, next){
    let objDb = new Db(pool);
    let sql = `select * from user`;
        try {
            objDb.getData(sql)
            .then(results => {
               res.send(results);
            })
            .catch(error => {
                res.send("error");
            });
        } catch (error) {
            res.send("error");
        }
});
