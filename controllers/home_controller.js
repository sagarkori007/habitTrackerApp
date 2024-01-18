const { Habit, HabitStatus , HabitTracking } = require('../models/habit');

//controller for the loading up the home and list the habits
module.exports.home = async (req,res) => {

    try {
        //find all the habits to display
        let habits = await Habit.find({})
        .sort('-createdAt')


        //render in the front end
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

