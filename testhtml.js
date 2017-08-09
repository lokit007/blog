let express = require("express");
let app =  express();

app.set("views", __dirname + "/views");
app.set("view engine", "jade");

app.listen(3000, function(){
    console.log("Server : http://localhost:%d", 3000);
});

app.get("/info", (req, res, next) => {
    let html = "<h1>Dữ liệu show</h1>";
    res.render("thanhvien/info", {data: html});
});