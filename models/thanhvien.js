function ThanhVien() {
    this.name,
	this.fullname,
	this.icon,
	this.birthday,
	this.create,
	this.job,
	this.email,
	this.phone,
	this.info,
	this.cv
}

module.exports = ThanhVien;

// sql insert
module.exports.getSqlInsert = function() {
    return "insert into thanhvien set ?";
};
// object insert
module.exports.getObjInsert = function(username, password, fullname, urlIcon, birthday, email, phone, job, info, urlCv) {
	let date = new Date();
    let objResult = {
	    UserName : username,
		PassWord : password,
		HoTen : fullname,
		Icon : urlIcon,
		SinhNhat : birthday,
		Email : email,
		DienThoai : phone,
		NgheNghiep : job,
		BanThan : info,
		FileCV : urlCv,
		LoaiThanhVien : "Thường",
		TrangThaiTruyCap : 1,
		NgayThamGia : date.toISOString().replace(/T/, " ").replace(/\..+/, "")
    }
    return objResult;
};
// fill data
module.exports.getDataResult = function(data) {
    let objResult = new ThanhVien();
    
    try {
        objResult.name = data.UserName,
        objResult.fullname = data.HoTen,
        objResult.icon = data.Icon,
        objResult.birthday = data.SinhNhat,
        objResult.create = data.NgayThamGia,
        objResult.job = data.NgheNghiep,
        objResult.email = data.Email,
        objResult.phone = data.DienThoai,
        objResult.info = data.BanThan,
        objResult.cv = data.FileCV
        return objResult;
    } catch (error) {
        return undefined;
    }
};