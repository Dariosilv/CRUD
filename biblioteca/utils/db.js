const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RootAdmin@24',
    port: 3306,
    database: 'dbbiblioteca',
    multipleStatements: true

});
db.connect((erro) => {
    if (erro){
        throw erro
    }
    console.log('Concetado ao BD....');
    
});

global.db = db;
module.exports = db;