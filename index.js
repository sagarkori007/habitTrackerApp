//import ejs 
const express = require('express');

//config the data base 
const mongodb = require('./config/mongoose');


//port 
const port = 8000;
//express js
const app = express();


//set view engine 
app.set('view engine','ejs');
//set the dynamic view folder
app.set('views', './views');


app.get('/', function(req,res){
    console.log('request received!!');
    return res.render('index',{title: "trying"});

});

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log('Server is up and running at port:', port);
})

