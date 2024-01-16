const express = require('express');
const router = express.Router();

//load the controller
const homeController = require('../controllers/home_controller');
const habitController = require('../controllers/habits_controller');


router.get('/',homeController.home);
router.post('/add-habit', habitController.addHabit);
router.post('/delete-habit/:habitId', habitController.deleteHabit);
router.get('/tracker',habitController.habitTrackerHome);
router.post('/tracker/updateStatus',habitController.updateStatus);
//router.get('/habit/:habitId', habitController.getHabitDetails);
//router.post('/update-habit-status', habitController.updateHabitStatus);


//check, message
console.log('router loaded!!')

module.exports = router;
