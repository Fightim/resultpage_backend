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

app.use(cors());

//db 상태 확인ㅑ
app.get('/db', (req, res) => {
    let token = req.headers.authorization;
    global.token = token;
    console.log(token);
    axios.get('https://dev.cloud-gui.com/rds/config',{headers:{Authorization: token}})
    .then(function (response) {
        const connection = mysql.createConnection({
            host : response.data.host,
            user : response.data.user,
            password : response.data.password
        });
        connection.connect(function (err,result){
            if (err){
                return res.status(404).json({
                    "error": {
                        "type": "NOT_FOUND",
                        "message": "no database server"
                    }
                })

            }
            else{
                return res.status(200).json({
                    "message": "DB server exist"
                })
            }

        });
    })
    .catch(function (error) {
        console.log(error);
    });
});

// 이름 받아오기
app.get('/text/:name', (req, res) => {
    let name = req.params.name
    console.log(token);
    console.log(req.params.name)
    axios.get('https://dev.cloud-gui.com/rds/config',{headers:{Authorization:token}})
    .then(function (response) {
	console.log(response.data);
        const connection = mysql.createConnection({
            multipleStatements: true,
            host : response.data.host,
            user : response.data.user,
            password : response.data.password
        });
console.log("before query");

        connection.query("CREATE DATABASE IF NOT EXISTS my_db CHARACTER SET UTF8; USE my_db; CREATE TABLE IF NOT EXISTS result(id INT UNSIGNED NOT NULL AUTO_INCREMENT, name VARCHAR(100) NULL, input_text TEXT NOT NULL, input_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, endpoint TEXT NOT NULL, PRIMARY KEY(id)); SELECT * FROM result WHERE name=?;",[name], function(err, result){
console.log("result : ", result);
            if(err){
console.log("here");
console.log(err);
                return res.status(404).json({
                    "error": {
                        "type": "NOT_FOUND",
                        "message": "No DB server"
                    }
                })
            }
            else if(result[3].length ==  0){
console.log("here2");
                return res.status(404).json({
                    "error": {
                        "type": "NOT_FOUND",
                        "message": "No data"
                    }
                })
            }
            else{
                return res.status(200).send(result[3])
            }

        });
    })          
    .catch(function (error) {
        console.log(error);
    });
});



// 이름 및 텍스트 등록
app.post('/text', (req, res) => {
    let name = req.body.name;
    let text = req.body.text;
    console.log(name,text)
    axios.get('https://dev.cloud-gui.com/rds/config',{headers:{Authorization:token}})
    .then(function (response) {
        const connection = mysql.createConnection({
            multipleStatements: true,
            host : response.data.host,
            user : response.data.user,
            password : response.data.password
        });

        connection.query("CREATE DATABASE IF NOT EXISTS my_db CHARACTER SET UTF8; USE my_db; CREATE TABLE IF NOT EXISTS result(id INT UNSIGNED NOT NULL AUTO_INCREMENT, name VARCHAR(100) NULL, input_text TEXT NOT NULL, input_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, endpoint TEXT NOT NULL, PRIMARY KEY(id)); INSERT INTO result (name, input_text, endpoint) VALUES (?, ?, ?);",[name, text, response.data.host],function(err,result){
            if(err){
                console.log(err)
                res.status(404).json({
                    "error": {
                        "type": "NOT_FOUND",
                        "message": "No DB server"
                    }
                })
            }
            else{
                connection.query("SELECT * FROM result WHERE id = (SELECT MAX(id) FROM result)",function(err2, result){
                    if(err2){
			console.log(err2)
                        res.status(404).json({
                            "error": {
                                "type": "NOT_FOUND",
                                "message": "Fail"
                            }
                        })
                    }
                    else{
			console.log(result)
                        res.status(200).send(result)
    
                    }
                });
            }
                
        });
    })
    .catch(function (error) {
        console.log(error);
    });
});


app.listen(port, ()=>console.log(`Server Start. Port : ${port}`));

