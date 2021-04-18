const express = require('express');
const bookingController = require('./../controller/bookingController')
const authController = require('./../controller/authController');
const { route } = require('./viewRoutes');


/// Routes
const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router.get('/', bookingController.getAllBookings)
    .post(bookingController.createBooking);

router.get('/:bookingId', bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);


module.exports = router;