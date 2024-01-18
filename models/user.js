const mongoose = require('mongoose');

//user schema 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
},{
    timestamps: true
});

//user collection creation 
const User = mongoose.model('User', userSchema);
module.exports = User;