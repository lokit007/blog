let Db = require("../models/database.js");
let ThanhVien = require("../models/thanhvien.js");

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
		res.render("thanhvien/login");
	});
	
	app.post("/login", (req, res, next) => {
		let db = new Db(pool);
		let sql = "select * from thanhvien where UserName = N? and PassWord = ? limit 1";
		try {
			db.getData(sql, [req.body.username, req.body.password])
			.then((data) => {
				if(data.length > 0) {
					var user = {
						name: data[0].UserName,
						key: data[0].PassWord,
						auto: false,
						icon: data[0].Icon
					};
					req.session.user = user;
					res.redirect("/");
				} else res.render("thanhvien/login", {data : "Tên đăng nhập hoặc mật khẩu không chính xác!"});
			})
			.catch((err) => {
				console.log("thanhvien.js line 38 : " + err);
				res.render("thanhvien/login", {data : "Tên đăng nhập hoặc mật khẩu không chính xác!"});
			});
		} catch(error) {
			console.log("thanhvien.js line 42 : " + error);
			res.render("thanhvien/login", {data : "Tên đăng nhập hoặc mật khẩu không chính xác!"});
		}
	});

	app.get("/logout", (req, res, next) => {
			req.session.user = undefined;
			res.redirect("/");
	});

	app.get("/signup", (req, res, next) => {
		res.render("thanhvien/signup");
	});

	app.post("/signup", upload.any(), (req, res, next) => {
		let objDb = new Db(pool);
		let sql = ThanhVien.getSqlInsert();
		let obj = {};
		let urlIcon = "";
		let urlCv = "";
		
		try {
			req.files.forEach(function(element) {
				if(element.fieldname = "icon") urlIcon = element.filename;
				else if(element.fieldname = "cv") urlCv = element.filename;
			});
			obj = ThanhVien.getObjInsert(req.body.username, req.body.password, req.body.fullname, urlIcon, req.body.birthday, req.body.email, req.body.phone, req.body.job, req.body.info, urlCv);
			pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(errTran){
          if(errTran) res.render("thanhvien/signup", {data: "Lỗi cập nhật dữ liệu! Nhấn F5 để tải lại trang và tiếp tục"});
          else objDb.executeQuery(sql, obj, connection)
            .then(results => {
              connection.commit(function(errComit){
                if(errComit) connection.rollback(function(){
                  res.render("thanhvien/signup", {data: "Lỗi cập nhật dữ liệu! Nhấn F5 để tải lại trang và tiếp tục"});
                });
                else res.redirect('/login');
              });
            })
            .catch(error => {
              connection.rollback(function(){
                res.render("thanhvien/signup", {data: "Lỗi cập nhật dữ liệu! Nhấn F5 để tải lại trang và tiếp tục"});
              });
            });
        });
      });
		} catch (error) {
			console.log(error);
			res.render("thanhvien/signup", {data: "Lỗi cập nhật dữ liệu! Nhấn F5 để tải lại trang và tiếp tục"});
		}
	});

	app.get("/info/:user", (req, res, next) => {
		let db = new Db(pool);
		let sql = "select * from thanhvien where UserName = N? limit 1";

		try {
			let userinfo = req.params.user;
			if(userinfo != undefined) {
				db.getData(sql, [userinfo])
				.then((data) => {
					if(data.length > 0) {
						let objresult = ThanhVien.getDataResult(data[0]);
						console.log(objresult);
						res.render("thanhvien/info", {data: objresult});
					} else res.send("Chưa đăng nhập");
				})
				.catch((err) => {
					console.log("thanhvien.js line 125 : " + err);
					res.send("Chưa đăng nhập");
				});
			} else res.send("Chưa đăng nhập");
		} catch (error) {
			console.log("thanhvien.js line 130 : " + error);
			res.send("Lỗi : " + error);
		}
	});

	app.get("/share/:user", (req, res, next) => {
		let db = new Db(pool);
		let sql = "select * from thanhvien where UserName = N? and PassWord = ? limit 1";

		try {
			let userinfo = req.params.user;
			let user = req.session.user;

			if(userinfo = user.name && user != undefined) {

			} else res.send("Chưa đăng nhập");
		} catch (error) {
			res.send("Lỗi : " + error);
		}
	});

	app.post("/checkusername", (req, res, next) => {
		let db = new Db(pool);
		let sql = "select * from thanhvien where UserName = N? limit 1";
		try {
			db.getData(sql, [req.body.username])
			.then((data) => {
				if(data.length > 0) res.send(false);
				else res.send(true);
			})
			.catch((err) => {
				console.log("thanhvien.js line 38 : " + err);
				res.send(true);
			});
		} catch(error) {
			console.log("thanhvien.js line 42 : " + error);
			res.send(true);
		}
	});
}