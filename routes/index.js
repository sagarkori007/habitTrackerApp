const express = require('express');
const router = express.Router();

//load the controller
const homeController = require('../controllers/home_controller');
const habitController = require('../controllers/habits_controller');


router.get('/',homeController.home);
//for adding the habit 
router.post('/add-habit', habitController.addHabit);

//route for deleting habit 
router.post('/delete-habit/:habitId', habitController.deleteHabit);

//route for tracking view for 6 dyas
router.get('/tracker',habitController.habitTrackerHome);

//route for the updating the habit status
router.post('/tracker/updateStatus',habitController.updateStatus);


//check, message
console.log('router loaded!!')

module.exports = router;
