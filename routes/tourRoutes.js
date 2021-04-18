const express = require('express');
const tourController = require('../controller/tourController')
const authController = require('../controller/authController')
const reviewRouter = require('../routes/reviewRoutes');

/// Routes
const router = express.Router();

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guides'), tourController.gettMonthlyPlan);

router.use('/:tourId/reviews', reviewRouter)
// router.param('id', tourController.checkId)
router.route('/top-5-tours')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit')
    .get(tourController.getDistances);

router.route('/')
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);

router.route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.upladTourImages, tourController.resizeTourImages, tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

//GET / tour/234234/reviews
//GET / tour/234234/reviews/asdas234

module.exports = router;