let thanhvien = require("./models/thanhvien.js");
let result = {
    UserName : "UserName",
	HoTen : "HoTen",
	Icon : "Icon",
	SinhNhat : "SinhNhat",
	NgayThamGia : "NgayThamGia",
	NgheNghiep : "NgheNghiep",
	Email : "Email",
	DienThoai : "DienThoai",
	BanThan : "BanThan",
	FileCV : "FileCV"
}
console.log(thanhvien.getSqlInsert());
console.log(thanhvien.getDataResult(result));
console.log(thanhvien.getObjInsert("1", "2", "3", "4", "5", "6", "7"));

let Model1 = require("./models/model1.js");

let obj1 = new Model1("Ten 1");
let obj2 = new Model1("Ten 2");

console.log(obj1.getInfo());
obj1.data.push(4);
console.log(obj1.getInfo());
console.log(obj2.getInfo());
// Như method static
console.log(Model1.getView());
let obj = Model1.getObj();
console.log(obj);
console.log(obj.name);
console.log(obj.getInfo());
console.log(Model1);

let date = new Date();
console.log(date.toISOString().replace(/T/, " ").replace(/\..+/, ""));