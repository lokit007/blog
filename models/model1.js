function Model1(name) {
    this.name = name;
    this.data = [1, 2, 3];
};

Model1.prototype.getInfo = function() {
    return "Obj : " + this.name + ", " + this.data;
};

module.exports = exports = Model1;

// Chú ý thứ tự
module.exports.getView = function() {
    return "View";
};

module.exports.getObj = function() {
    let objResult = new Model1("Tên này")
    return objResult;
};