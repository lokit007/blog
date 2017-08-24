let Db = require("../models/database.js");

module.exports = (app, pool) => {
	app.get("/post", (req, res, next) => {
		let sql = "select IdDanhMuc, PhanCap, HienThi, DanhMucCha, Icon, TieuDe from ngonngu inner join danhmuc on ngonngu.IdLienKet = danhmuc.IdDanhMuc where NgonNguChon = ?";
		let results = new Array();
		let db = new Db(pool);
		
		try {
			db.getData(sql, [req.getLocale()])
			.then((datas) => {
				datas.map((category) => {
					results.push({id: category.IdDanhMuc, name: category.TieuDe});
				});
				res.render("post/new", {data: results});
			})
			.catch((err) => {
				res.send("Lỗi" + err);
			});
		} catch (error) {
			res.send("Lỗi" + error);
		}
	});
}