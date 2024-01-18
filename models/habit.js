const mongoose = require('mongoose');

//habit schema 
const habitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

//schema for status 
const habitStatusSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ['Done', 'Not done', 'None'],
    }
});

//schema for tracking the habit along with the status
const habitTrackingSchema = new mongoose.Schema({
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        require: true
    },

    //for tracking the 6 days status 
    dailyStatus: [{
        status: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HabitStatus',
            required: true
        },
        trackingDate: {
            type: Date,
            default: Date.now
        }
    }]
});


//create collections
const Habit = mongoose.model('Habit', habitSchema);
const HabitStatus = mongoose.model('HabitStatus', habitStatusSchema);
const HabitTracking = mongoose.model('HabitTracking', habitTrackingSchema);

//export the collections
module.exports = {
    Habit,
    HabitStatus,
    HabitTracking
};