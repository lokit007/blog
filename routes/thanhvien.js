let Db = require("../models/database.js");
let multer  = require('multer');
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.username + '_' + file.fieldname + "." + file.originalname.substr(file.originalname.lastIndexOf(".")+1))
  }
});
let upload = multer({ storage: storage });

module.exports = (app, pool) => {
	
	app.get("/login", (req, res, next) => {
		res.render("thanhvien/signup");
	});
	
	app.get("/signup", (req, res, next) => {
		res.render("thanhvien/signup");
	});

	app.post("/signup", upload.any(), (req, res, next) => {
		// fieldname filename

		// for(index, file in req.files){
		// 	console.log(req.files[index]);
		// 	console.log(file);
		// }

		res.send(req.body);
	});

	app.post("/checkusername", (req, res, next) => {
		let db = new Db(pool);
		let sql = "select * from user where UserName = ? limit 1";
		try {
			db.getData(sql, [req.body.username])
			.then((data) => {
				if(data.length() > 0) res.send(false);
				else res.send(true);
			})
			.catch((err) => {
				res.send(true);
			});
		} catch(error) {
			res.send(true);
		}
	});
}