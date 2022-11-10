const axios = require('axios');
const mysql = require('mysql');
const express = require("express");
const app = express();
const port = 80;
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));

app.get('/text/:name', (req, res) => {
    var name = req.params.name
    console.log(req.params.name)
    axios.get('http://15.164.222.12/')
    .then(function (response) {
        const connection = mysql.createConnection({
            host : response.data.host,
            user : response.data.username,
            password : response.data.password,
            database : response.data.database
        });
        connection.connect();
        connection.query('select * from result', function(err){
            if(err){
                connection.query('CREATE TABLE result(id INT(100) NOT NULL AUTO_INCREMENT, name VARCHAR(100), text TEXT NOT NULL, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, endpoint TEXT NOT NULL, CONSTRAINT result_pk PRIMARY KEY(id));')
                return ;
            }
            });
        connection.query('select * from result  where name=?',[name], function(err1, result){
            if(err1){
                res.status(404).json({
                    "error": {
                        "type": "NOT_FOUND",
                        "message": "Fail"
                    }
                })
                return ;
            }
 	    console.log(result)
            res.status(200).send(result)
        });

    })
    .catch(function (error) {
        console.log(error);
    });
});


app.post('/text', (req, res) => {
    var name = req.body.name;
    var text = req.body.text;
    axios.get('http://15.164.222.12/')
    .then(function (response) {
        const connection = mysql.createConnection({
            host : response.data.host,
            user : response.data.username,
            password : response.data.password,
            database : response.data.database
        });
        connection.connect();
        connection.query('select * from result', function(err){
            if(err){
                connection.query('CREATE TABLE result(id INT(100) NOT NULL AUTO_INCREMENT, name VARCHAR(100), text TEXT NOT NULL, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, endpoint TEXT NOT NULL, CONSTRAINT result_pk PRIMARY KEY(id));')
                return ;
            }
            });

        connection.query('INSERT INTO result (name, text, endpoint) VALUES (?, ?, ?)',[name, text, response.data.host],function(err1,result1){
            if(err1){
                res.status(404).json({
                    "error": {
                        "type": "NOT_FOUND",
                        "message": "Fail"
                    }
                })
                return ;
            }
            connection.query('SELECT * FROM result WHERE id = (SELECT max(id) FROM result)',function(err2, result){
                if(err2){
                    res.status(404).json({
                        "error": {
                            "type": "NOT_FOUND",
                            "message": "Fail"
                        }
                    })
                    return ;
                }
	        console.log(result)
                res.status(200).json({
                    result
                    })
            });

        });

    })
    .catch(function (error) {
        console.log(error);
    });
});

app.listen(port, ()=>console.log(`Server Start. Port : ${port}`));
