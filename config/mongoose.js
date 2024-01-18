//use mongoose
const mongoose = require('mongoose');

//local database connection 
mongoose.connect('mongodb://127.0.0.1/habit_tracker');


const db = mongoose.connection;

//on connection failure
db.on('error', function(err){
    console.log('Error in connecting to the db',err);
});

//on successful connection
db.once('open', function(){
    console.log('Connected to data base!!!');
});