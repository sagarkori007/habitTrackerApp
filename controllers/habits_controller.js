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
    },

    habitTrackerHome: async (req, res) => {
        try {
            const habits = await Habit.find();
            const habitsWithStatus = [];

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
    updateStatus: async (req, res) => {
        try {
            console.log('Updating habit status started');
            const { habitId, trackingDate, newStatus } = req.body;
            // console.log(habitId, trackingDate, newStatus, req.params);
            const habitTrackingToUpdate = await HabitTracking.findOne({ habit: habitId, 'dailyStatus.trackingDate': trackingDate });
    
            if (!habitTrackingToUpdate) {
                return res.status(404).json({ message: 'Habit tracking record not found for the specified date' });
            }
    
            const habitStatus = await HabitStatus.findOne({ status: newStatus });
            if (!habitStatus) {
                return res.status(404).json({ message: 'Invalid habit status' });
            }
    
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

module.exports = habitController;

