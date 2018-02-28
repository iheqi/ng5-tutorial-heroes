var express = require('express'); 
var app = express();               
var assert = require('assert');


var MongoClient = require('mongodb').MongoClient;
var dbURL = 'mongodb://localhost:27017';

var bodyParser = require('body-parser');
var cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.get('/heroes',function(req, res) {
    MongoClient.connect(dbURL,function(err, db) {
        assert.equal(err,null);
        
        const tutorial = db.db('ng5-tutorial');
        const heroes = tutorial.collection('heroes');

        heroes.find({}).toArray(function(error, docs) {
            res.send(docs);         
            res.end();
            db.close();
        })
    })
})

app.get('/search',function(req, res) {
    let term = req.query;
    MongoClient.connect(dbURL,function(err, db) {
        assert.equal(err,null);
        
        const tutorial = db.db('ng5-tutorial');
        const heroes = tutorial.collection('heroes');

        heroes.find({ "name": term.name}).toArray(function(error, docs) {
            res.send(docs);         
            res.end();
            db.close();
        })
    })
})

app.get('/hero/:id',function(req, res) {
    let id = parseInt(req.params["id"]);
    MongoClient.connect(dbURL,function(err, db) {
        assert.equal(err,null);
        
        const tutorial = db.db('ng5-tutorial');
        const heroes = tutorial.collection('heroes');

        heroes.findOne({"id": id}, null, (err, docs) => {
            res.send(docs);         
            res.end();
            db.close();
        })
    })
})

app.post('/update',function(req, res) {
    // console.log(req.body);
    let hero = req.body;
    
    MongoClient.connect(dbURL,function(err, db) {
        assert.equal(err,null);
        
        const tutorial = db.db('ng5-tutorial');
        const heroes = tutorial.collection('heroes');

        heroes.updateOne({ "id": hero.id }, { $set: { "name": hero.name } }, function(error, result) {
            let rst = JSON.parse(result);

            if (rst.n === 1) {
                console.log("修改成功。");
            } else {
                console.log("修改失败,error：" + error);
            }
            res.end();
            db.close();
        })
    })
})

app.post('/insert',function(req, res) {
    let hero = req.body;
    
    MongoClient.connect(dbURL,function(err, db) {
        assert.equal(err,null);
        
        const tutorial = db.db('ng5-tutorial');
        const heroes = tutorial.collection('heroes');

        heroes.insertOne({ "id": hero.id, "name": hero.name }, function(error, result) {
            let rst = JSON.parse(result);

            if (rst.n === 1) {
                console.log("插入成功。");
            } else {
                console.log("插入失败,error：" + error);
            }
            res.end();
            db.close();
        })
    })
})

app.listen(process.env.POST || 8080);