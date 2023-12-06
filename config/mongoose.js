//use mongoose
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/habit_tracker');


const db = mongoose.connection;

db.on('error', function(err){
    console.log('Error in connecting to the db',err);
});

db.once('open', function(){
    console.log('Connected to data base!!!');
});