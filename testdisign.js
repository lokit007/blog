let express = require("express");
let session = require('express-session');
let i18n = require("i18n");
let app = express();
let port = process.env.PORT || 3000;
let mysql = require("mysql");
let Db = require("./models/database.js");
let configData = require("./configs/connection-data.js");
let pool = mysql.createPool(configData.dataonline);
let ThanhVien = require("./models/thanhvien.js");

app.set("view engine", "jade");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.use(session({
	secret: 'Session module',
	resave: false,
	saveUninitialized: true
}));

let lgs = ['vi', 'en'];
i18n.configure({
    /**
     * Setup some locales - other locales default to en silently
     */
    locales: lgs,
    /**
     * object or [obj1, obj2] to bind the i18n api and current locale to - defaults to null
     */
    register: global,
    /**
     * fall back from Dutch to German
     */
    fallbacks:{'vi': 'en'},
    /**
     * sets a custom cookie name to parse locale settings from - defaults to NULL
     */
    cookie: 'language',
    /**
     * you may alter a site wide default locale
     */
    defaultLocale: 'en',
    /**
     * query parameter to switch locale (ie. /home?lang=ch) - defaults to NULL
     */
    queryParameter: 'lang',
    /**
     * watch for changes in json files to reload locale on updates - defaults to false
     * whether to write new locale information to disk - defaults to true
     * sync locale information accros all files - defaults to false
     */
    autoReload: true,
    updateFiles: true,
    syncFiles: true,
    /**
     * where to store json files - defaults to './locales' relative to modules directory
     */
    directory: __dirname + '/languages',
    /**
     * hash to specify different aliases for i18n's internal methods to apply on the request/response objects (method -> alias).
     * note that this will *not* overwrite existing properties with the same name
     */
    api: {
      '__': '__',
      '__n': '__n'
    },
    /**
     * Downcase locale when passed on queryParam; e.g. lang=en-US becomes
     * en-us.  When set to false, the queryParam value will be used as passed;
     * e.g. lang=en-US remains en-US.
     */
    preserveLegacyCase: true
});
app.use(i18n.init);
app.use(function(req, res, next){
    if(req.query.lang) {
        i18n.setLocale(req.query.lang);
    }
    res.locals.clanguage = req.getLocale();
    res.locals.languages = i18n.getLocales();
    res.locals.session = req.session;
    next();
});

app.listen(port, function(){
	console.log("Demo responsive : http://localhost:%d", port);
});

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/login", (req, res) => {
    res.render("thanhvien/login");
});

app.get("/signup", (req, res) => {
    res.render("thanhvien/signup");
});

app.get("/info/:user", (req, res) => {
    let db = new Db(pool);
    let sql = "select * from thanhvien where UserName = N? limit 1";

    try {
        let userinfo = req.params.user;
        if(userinfo != undefined) {
            db.getData(sql, [userinfo])
            .then((data) => {
                if(data.length > 0) {
                    let objresult = ThanhVien.getDataResult(data[0]);
                    res.render("thanhvien/info", {data: objresult});
                } else {
                    res.render("home", {data: "Thành viên không tồn tại trong hệ thống!!!"});
                }
            })
            .catch((err) => {
                console.log("thanhvien.js line 125 : " + err);
                res.render("home", {data: "Thành viên không tồn tại trong hệ thống!!!"});
            });
        } else res.render("home", {data: "Thành viên không tồn tại trong hệ thống!!!"});
    } catch (error) {
        console.log("thanhvien.js line 130 : " + error);
        res.render("home", {data: "Thành viên không tồn tại trong hệ thống!!!"});
    }
});