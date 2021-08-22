const express = require('express');
const app = express();

app.set('view engine','hbs');
app.use(express.urlencoded({ extended: true }));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

const {MongoClient, ObjectId} = require('mongodb');
const url = 'mongodb+srv://hoangsonn:123456abc@cluster0.gi3n7.mongodb.net/test';
const url = "mongodb://localhost:27017";

app.get('/', async function(req,res){
    const client= await MongoClient.connect(url);
    const dbo = client.db("ASM2");
    const results = await dbo.collection("products").find({}).toArray();
    res.render('index', {products : results});
})

app.get('/delete',async function(req,res){
    const id = req.query.id;
    const condition = {"_id" : ObjectId(id)};

    const client= await MongoClient.connect(url);
    const dbo = client.db("ASM2");

    await dbo.collection("products").deleteOne(condition);
    res.redirect('/');
})

app.get('/insert',async function(req,res){
    res.render('insert');
})

app.post('/doInsert',async function (req,res){
    const client= await MongoClient.connect(url);
    const dbo = client.db("ASM2");
    const Name = req.body.txtName;
    const Price = req.body.txtPrice;
    const Description = req.body.txtDescription;
    const newProduct = {name : Name, price : Price, description: Description};
    await dbo.collection("products").insertOne(newProduct);
    console.log(newProduct);
    
    res.redirect('/');
});

const PORT = process.env.PORT || 5000
app.listen(PORT);
console.log("Server is running at " + PORT)