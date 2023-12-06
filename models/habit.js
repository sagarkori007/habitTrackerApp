const mongoose = require('mongoose');


const habitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
});

const habitStatusSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ['Done', 'Not done', 'None'],
    },
});

const habitTrackingSchema = new mongoose.Schema({
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        require: true,
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HabitStatus',
        required: true,
    },
    trackingDate: {
        type: Date,
        default: Date.now,
    },
    
});

const Habit = mongoose.model('Habit',habitSchema);
const HabitStatus = mongoose.model('HabitStatus',habitStatusSchema);
const HabitTracking = mongoose.model('HabitTracking',habitTrackingSchema);

module.exports = {
    Habit,
    HabitStatus,
    HabitTracking
};

