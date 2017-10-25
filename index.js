// Read the file and print its contents.
var app= require('express')();
var http= require('http').Server(app);
var Cloudant=require('cloudant');
var me = '';
// var username = process.env.cloudant_username || "nodejs";
// var password = process.env.cloudant_password;
// var cloudant = Cloudant("https://56c7d887-694a-47f2-8bda-0f9323cc7a0e-bluemix:1a932789536cbff21413a13691dbf6e6d03f34a51c6ac7ecdb4334b45cfa62c3@56c7d887-694a-47f2-8bda-0f9323cc7a0e-bluemix.cloudant.com");
 
var fs = require('fs')
, filename = "./EMEA.csv";
fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + filename);
    const lines = data.split('\n').map(line => {
        return line.replace('\r', '').split(',')
    });
    const cloudantObjects = lines.map(l => {
        return {
            region: l[0],
            countryNumber: l[1],
            countryName: l[2],
            userID: l[3]
        }
    });
    app.post('/', function(req,res){
        var db=cloudant.db.use('empldb')
        cloudantObjects.forEach(cloudObj => {
            db.insert(cloudObj,(err,doc)=>{
                if(err){res.status(400).end()}      
                else{res.json(cloudObj)}
            });
        });
    });
});