const { Habit, HabitStatus , HabitTracking } = require('../models/habit');

module.exports.home = async (req,res) => {

    try {
        let habits = await Habit.find({})
        .sort('-createdAt')

        return res.render('layout',
        {
            title: 'Habit Tracking App',
            habits: habits,
        })
    } catch (error) {
        console.log("error in rendering the habits!!!",error);
        return ;
    }

}

