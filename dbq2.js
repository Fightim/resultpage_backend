

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
    origin: "http://52.79.253.178",
    credentials: true,
  }));

app.get('/text/:name', (req, res) => {
    let isError = null;
    var name = req.params.name
    console.log(req.params.name)
    axios.get('http://15.164.222.12/')
    .then(function (response) {
        const connection = mysql.createConnection({
            host : response.data.host,
            user : response.data.username,
            password : response.data.password
        });

        connection.query("CREATE DATABASE IF NOT EXISTS my_db CHARACTER SET UTF8; use my_db; CREATE TABLE IF NOT EXISTS result(id INT UNSIGNED NOT NULL AUTO_INCREMENT, name VARCHAR(100) NULL, 'text' TEXT NOT NULL, 'date' TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, endpoint TEXT NOT NULL, PRIMARY KEY(id)); SELECT * FROM result WHERE name=?;",[name], function(err, result){
            if(err){
                console.log(err);
                return res.status(404).json({
                    "error": {
                        "type": "NOT_FOUND",
                        "message": "No DB server"
                    }
                })
            }
            else if(result.length ==  0){
                return res.status(404).json({
                    "error": {
                        "type": "NOT_FOUND",
                        "message": "No data"
                    }
                })
            }
            else{
                return res.status(200).send(result)
            }

        });
    })          
    .catch(function (error) {
        console.log(error);
    });
});

app.listen(port, ()=>console.log(`Server Start. Port : ${port}`));


