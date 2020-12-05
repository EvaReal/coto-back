const express = require('express')
const app = express()
var cors = require('cors')

require('dotenv').config()

const hostname = '127.0.0.1';
var port = process.env.PORT || 8080;
var mysql = require('mysql');
const axios = require('axios');

// body parser
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(cors())

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));
let objConnection = require('./config/db.config.js').objConnection;

var connection = mysql.createConnection(objConnection);
console.log(objConnection)


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

app.get('/', (req, res) => {
    res.render("menu.ejs");

})

app.get('/pareto', (req, res) => {
    res.render("pareto.ejs", {
        navbar: 'navbar.ejs',
        footer: 'footer.ejs',
        title: 'Pareto Analysis',
        faults: faults,
        total: total
    });
})

app.get('/summary', (req, res) => {
    res.render("summary.ejs", {
        navbar: 'navbar.ejs',
        footer: 'footer.ejs',
        title: 'Summary'
    });

})

app.get('/charts', (req, res) => {
    res.render("charts.ejs", {
        navbar: 'navbar.ejs',
        footer: 'footer.ejs',
        title: 'Chart'
    });

})

app.get('/chartsjs', (req, res) => {
    res.render("chartsjs.ejs", {
        navbar: 'navbar.ejs',
        footer: 'footer.ejs',
        chart_legend: 'chartjs-legend.ejs',
        title: 'Chart'
    });
})

app.get('/login', (req, res) => {
    res.render("login.ejs", {
        navbar: 'navbar.ejs',
        footer: 'footer.ejs',
        title: 'Login'
    });

})

app.post("/login", (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host')
    let requestUrl = `${fullUrl}/api/users`
    console.log("=====requestUrl")
    console.log(requestUrl)
    axios.get(requestUrl)
        .then(function(response) {
            let arr = response.data
            var item = arr.findIndex(item => item.username === req.body.name);
            console.log(item)
            if (item == -1) {
                res.redirect("/login")
            } else {
                console.log(arr[item].passwords)
                if (arr[item].passwords == req.body.pass) {
                    res.redirect("/filter")
                } else {

                    res.redirect("/login")
                }
            }
        })
        .catch(function(error) {
            console.log(error);
            console.log("there was an error")
            res.end()
        })
})

app.get('/filter', (req, res) => {
    res.render("filter.ejs", {
        navbar: 'navbar.ejs',
        footer: 'footer.ejs',
        title: 'File Selection Criteria'
    });

})

app.get('/testinfo', (req, res) => {
    res.render("testinfo.ejs", {
        navbar: 'navbar.ejs',
        footer: 'footer.ejs',
        title: 'Test Information'
    });

})

app.get("/api/:testparam", (req, res) => {
    let param = req.params.testparam
    console.log(param)
    connection.query(`SELECT * FROM Coto.${param};`, function(error, rows, fields) {
        if (error) {
            console.log("Failed to query " + error)
            res.status(404).render('dberr.ejs');
            return
        }
        res.json(rows)
    });
})

app.get("/api/users", (req, res) => {
    console.log(param)
    connection.query(`SELECT * FROM Coto.users;`, function(error, rows, fields) {
        if (error) {
            console.log("Failed to query " + error)
            res.status(404).render('dberr.ejs');
        }
        res.json(rows)
    });
})

app.use(function(req, res) {
    res.status(404).render('404.ejs');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


//Pareto
const tables = [{ name: 'Actuate Time', acces: 'actuate_time' }, { name: 'Coils Resistance', acces: 'coil_resistance' }, { name: 'CRS', acces: 'crs' }, { name: 'DCR', acces: 'dcr' }, { name: 'Operate Current', acces: 'operate_current' }, { name: 'Operate Time', acces: 'operate_time' }, { name: 'Operate Voltage', acces: 'operate_voltage' }];
var faults = [];
var total = 0;

for (var table of tables) {
    var text = `SELECT * FROM \`${table.acces}\` WHERE \`flag\` = "1"`;
    getFaults(table);

    text = `SELECT * FROM \`${table.acces}\``;
    getQuantity(table);
}

function getFaults(table) {
    con.query(text, function(error, results, fields) {
        if (error)
            throw error;

        faults.push({ name: `Falla ${table.name}`, quantity: results.length });
    });
}

function getQuantity(table) {
    con.query(text, function(error, results, fields) {
        if (error)
            throw error;

        total += results.length;
    });
}