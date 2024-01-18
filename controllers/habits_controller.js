const { Habit, HabitStatus, HabitTracking} = require('../models/habit');

const habitController = {
    // add habit 
    addHabit: async (req, res) => {
        try {
            console.log('add habit task started');
            console.log(req.body);

            //create new habit 
            const habit = await Habit.create({
                name: req.body.habitName
            });
            
            //set the default status of the habit as none
            let defaultStatusNone = await HabitStatus.findOne({status: 'None'});
            //console.log(defaultStatusNone);

            if (!defaultStatusNone){
                // if status are not present in the db create them and store it
                await HabitStatus.create({status: 'None'});
                await HabitStatus.create({status: 'Done'});
                await HabitStatus.create({status: 'Not done'});

                //set the none status id 
                defaultStatusNone = await HabitStatus.findOne({status: 'None'});
            }

            // Get today's date
            const currentDate = new Date().toISOString().split('T')[0];  

            // Create a default habit tracking for today with 'None' status
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

    //delete the habit 
    deleteHabit: async(req,res) =>{
        try{
            console.log('habit deleting started');
            console.log(req.params.habitId);
            //get the habitId from the form
            const habitId = req.params.habitId;

            //get the object to delete
            const habitToDelete = await Habit.findById(habitId);
            console.log('habit to delete: ',habitToDelete);

            //delete the dependencies 
            await HabitTracking.deleteOne({habit: habitId});

            //finally delete the habit
            await Habit.deleteOne({_id:habitToDelete._id});

            console.log('Habit deleted successfully', habitToDelete);
            res.redirect('back');
            //res.status(204).json({message: 'Habit deleted successfully'});

        }catch (error){
            console.error('Error deleting habit:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // habit tracking view 
    habitTrackerHome: async (req, res) => {
        try {
            //get all the present habits
            const habits = await Habit.find();
            const habitsWithStatus = [];

            //for 6 days data 
            for (const habit of habits) {
                const habitTracking = await HabitTracking.findOne({ habit: habit._id })
                    .populate({
                        path: 'dailyStatus.status',
                        model: 'HabitStatus'
                    })
                    .sort({ 'dailyStatus.trackingDate': -1 })
                    .limit(6);

                habitsWithStatus.push({
                    habit,
                    habitTracking: habitTracking || { dailyStatus: [] } // Default to empty array if no tracking data
                });

                // console.log(habit.name,habitTracking);
            }

            //console.log(habitsWithStatus);
            return res.render('trackerHome', { habitsWithStatus });
        } catch (error) {
            console.error('Error fetching habits and their status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    //updating the habit status
    updateStatus: async (req, res) => {
        try {
            console.log('Updating habit status started');
            const { habitId, trackingDate, newStatus } = req.body;
            // console.log(habitId, trackingDate, newStatus, req.params);

            //find the required habit 
            const habitTrackingToUpdate = await HabitTracking.findOne({ habit: habitId, 'dailyStatus.trackingDate': trackingDate });
    
            if (!habitTrackingToUpdate) {
                return res.status(404).json({ message: 'Habit tracking record not found for the specified date' });
            }
            
            //change the habit status to the provided 
            const habitStatus = await HabitStatus.findOne({ status: newStatus });
            if (!habitStatus) {
                return res.status(404).json({ message: 'Invalid habit status' });
            }
            
            //update the status index 
            const existingStatusIndex = habitTrackingToUpdate.dailyStatus.findIndex(status => status.trackingDate.toISOString().split('T')[0] === trackingDate);
            if (existingStatusIndex !== -1) {
                habitTrackingToUpdate.dailyStatus[existingStatusIndex].status = habitStatus._id;
            } else {
                habitTrackingToUpdate.dailyStatus.push({ status: habitStatus._id, trackingDate });
            }
    
            await habitTrackingToUpdate.save();
    
            console.log('Habit status updated successfully', habitTrackingToUpdate);
            res.status(200).json({ message: 'Habit status updated successfully' });
    
        } catch (error) {
            console.error('Error updating habit status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    

}

//export the controllers
module.exports = habitController;

