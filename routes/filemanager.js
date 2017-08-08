let fs = require("fs");
let multer  = require('multer');
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
let upload = multer({ storage: storage });

module.exports = (app, pool) => {
	app.get("/file-manager", (req, res, next) => {
		let lst = fs.readdirSync("./public/uploads");
		res.render("files/_filebrowser", { data: lst});
	});
	
	app.post("/uploadfiles", upload.any(), (req, res, next) => {
		res.send("Tải lên máy chủ thành công! URL : uploads/" + req.files[0].filename);
	});

}
