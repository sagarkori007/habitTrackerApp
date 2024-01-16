const { Habit, HabitStatus, HabitTracking} = require('../models/habit');

const habitController = {
    // add habit 
    addHabit: async (req, res) => {
        try {
            console.log('add habit task started');
            console.log(req.body);

            const habit = await Habit.create({
                name: req.body.habitName
            });
            
            let defaultStatusNone = await HabitStatus.findOne({status: 'None'});
            //console.log(defaultStatusNone);
            if (!defaultStatusNone){
                await HabitStatus.create({status: 'None'});
                await HabitStatus.create({status: 'Done'});
                await HabitStatus.create({status: 'Not done'});

                defaultStatusNone = await HabitStatus.findOne({status: 'None'});
            }

            // Create a default habit tracking for today with 'None' status
            const currentDate = new Date().toISOString().split('T')[0];  // Get today's date
            const habitTracking = await HabitTracking.create({
                habit: habit._id,
                dailyStatus: [{
                    status: defaultStatusNone._id,
                    trackingDate: currentDate
                }]
            });

            // Set the status as 'None' for the last 6 days
            for (let i = 1; i <= 6; i++) {
                const lastDate = new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - i)).toISOString().split('T')[0];
                habitTracking.dailyStatus.push({
                    status: defaultStatusNone._id,
                    trackingDate: lastDate
                });
            }

            /*
            //simplified version
            const currentDate = new Date();

            for (let i = 1; i <= 6; i++) {
                const previousDate = new Date(currentDate);
                previousDate.setDate(currentDate.getDate() - i);

                const formattedDate = previousDate.toISOString().split('T')[0];

                console.log(formattedDate);
            }
            */

            await habitTracking.save();


            await habit.save();

            console.log('Habit created successfully:', habit);
            res.redirect('back');

        } catch (error) {
            console.error('Error adding habit:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteHabit: async(req,res) =>{
        try{
            console.log('habit deleting started');
            console.log(req.params.habitId);
            const habitId = req.params.habitId;

            const habitToDelete = await Habit.findById(habitId);
            console.log('habit to delete: ',habitToDelete);

            await HabitTracking.deleteOne({habit: habitId});

            await Habit.deleteOne({_id:habitToDelete._id});

            console.log('Habit deleted successfully', habitToDelete);
            res.redirect('back');
            //res.status(204).json({message: 'Habit deleted successfully'});

        }catch (error){

            console.error('Error deleting habit:', error);
            
            res.status(500).json({ error: 'Internal Server Error' });

        }
    }

}

module.exports = habitController;

