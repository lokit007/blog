/**
 * Config Connection MySql
 */
// Demo localhost
module.exports.datalocalhost = {
    // Số lượng kết nối tối đa
    connectionLimit: 1000,
    connectTimeout : 60 * 60 * 1000,
    aquireTimeout  : 60 * 60 * 1000,
    timeout        : 60 * 60 * 1000,
    host           : "localhost",
    port           : "3306",
    user           : "root",
    password       : "nhanviet1",
    database       : "grocerydb",
    multipleStatements : true
};
// Demo online : mysql://bac65a4df0c518:1a4e7f25@us-cdbr-iron-east-03.cleardb.net/heroku_e28276a5872ba54?reconnect=true
module.exports.dataonline = {
    connectionLimit: 1000,
    connectTimeout : 60 * 60 * 1000,
    aquireTimeout  : 60 * 60 * 1000,
    timeout        : 60 * 60 * 1000,
    host           : "us-cdbr-iron-east-03.cleardb.net",
    port           : "3306",
    user           : "bac65a4df0c518",
    password       : "1a4e7f25",
    database       : "heroku_e28276a5872ba54",
    multipleStatements : true
};