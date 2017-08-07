
module.exports = (app, pool) => {
	
	app.get("/file-manager", (req, res, next) => {
		var lst = ["123_cvfile.gif", "123_icon.gif", "123_icon.PNG"];
		res.render("files/_filebrowser", { data: lst});
	});
	
	// app.post("/uploadfiles", upload.any(), (req, res, next) => {
	// 	// fieldname filename
	// 	res.send(req.body);
	// });

}
