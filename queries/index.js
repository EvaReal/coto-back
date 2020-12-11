var mysql = require('mysql');

let objConnection = require('../config/db.config.js').objConnection;
var connection = mysql.createConnection(objConnection);
console.log(objConnection);

var con = mysql.createConnection({
    host: "coto-1.cjlxz9e5sgts.us-west-1.rds.amazonaws.com",
    user: "admin",
    database: 'Coto',
    password: "cfpfk5qf"
});

con.connect(function(err) {
    if (err) {
        throw err;
    } else {
        console.log('Data Base connected!');
    }
});

//Pareto
const tables = [{ name: 'Actuate Time', acces: 'actuate_time' }, { name: 'Coils Resistance', acces: 'coil_resistance' }, { name: 'CRS', acces: 'crs' }, { name: 'DCR', acces: 'dcr' }, { name: 'Operate Current', acces: 'operate_current' }, { name: 'Operate Time', acces: 'operate_time' }, { name: 'Operate Voltage', acces: 'operate_voltage' }];


async function getFaults() {
    var total = 0;
    var array = [];

    for (var table of tables) {
        var text = `SELECT * FROM \`${table.acces}\` WHERE \`flag\` = "1"`;
        array = array.concat(await getFault(table, text));

        text = `SELECT * FROM \`${table.acces}\``;
        total += await getQuantity(text);
    }

    return { array: array, total: total };
}

async function getFault(table, text) {
    let array = [];
    let results = await queryPromise(text);

    array.push({ name: `Falla ${table.name}`, quantity: results.length });

    return array;
}

async function getQuantity(text) {
    let results = await queryPromise(text);

    let total = results.length;

    return total;
}

function queryPromise(str) {
    return new Promise((resolve, reject) => {
        con.query(str, (error, results, fields) => {
            if (error) reject(error);
            resolve(results);
        })
    })
}

exports.getFaults = getFaults;