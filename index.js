//import ejs 
const express = require('express');

//body parser for data read
const bodyParser = require('body-parser');

//config the data base 
const mongodb = require('./config/mongoose');

//port 
const port = 8000;
//express js
const app = express();

//to receive and read the json content from front end
app.use(express.json());
app.use(express.static('./assets'));
// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

//set view engine 
app.set('view engine','ejs');
//set the dynamic view folder
app.set('views', './views');


app.use('/',require('./routes/index'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log('Server is up and running at port:', port);
})

