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
		let sql = "insert into thanhvien set ?";
		let obj = {};
		let urlIcon = "";
		let urlCv = "";
		
		try {
			req.files.forEach(function(element) {
				if(element.fieldname = "icon") urlIcon = element.filename;
				else if(element.fieldname = "cv") urlCv = element.filename;
			});

			obj = {
				"UserName":req.body.username,
				"PassWord":req.body.password,
				"HoTen":req.body.fullname,
				"Icon":urlIcon,
				"SinhNhat":req.body.birthday,
				"Email":req.body.email,
				"DienThoai":req.body.phone,
				"NgheNghiep":req.body.job,
				"BanThan":req.body.info,
				"FileCV":urlCv,
				"LoaiThanhVien":"Thường",
				"TrangThaiTruyCap":1,
				"NgayThamGia":"20170809"
			}

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
						let objresult = {
							name : data[0].UserName,
							fullname : data[0].HoTen,
							icon : data[0].Icon,
							birthday : data[0].SinhNhat,
							create : data[0].NgayThamGia,
							job : data[0].NgheNghiep,
							email : data[0].Email,
							phone : data[0].DienThoai,
							info : data[0].BanThan,
							cv : data[0].FileCV
						};
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