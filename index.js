// Read the file and print its contents.
const app= require('express')();
const http= require('http').Server(app);
const Cloudant=require('cloudant');
const fs = require('fs')
const filename = "./EMEA.csv";
const account = "7f7927e0-886e-48f7-bc91-680d9a7d81b4-bluemix";
const password = "c1be51bb8656cbaa14191468a4e48da23e15da01c7aa565136ce1ca098e436e2";
const cloudant = Cloudant({account, password}, (err, cloudant) => {
  if (err) {
    console.log('db error')
  } else {
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
        const db=cloudant.db.use('test')
        db.bulk({docs: cloudantObjects}, (err, docs) => {
          if (err) {
            console.log(err)
          } else {
            console.log('docs inserted')
          }
        })
    });
  }
})