const User = require('../models/userModel');
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
    //1. get Tour data from the collection
    const tours = await Tour.find();

    //2. build the temmplates

    //3. render that template using tour data from 1.
    res.status(200).render('overview', {
        title: 'All tours',
        tours
    });
})

exports.getTour = catchAsync(async (req, res, next) => {
    //1 get tge data fir the requested tour{including tour guides and reviews}
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: "rating rating user"
    });
    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404))
    }

    // 2 build template

    // 3. render template using data from 1.
    res.status(200)
        // .set(
        //     'Content-Security-Policy',
        //     "connect-src 'self' https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com 'unsafe-inline' 'unsafe-eval';"
        // )
        // .set(
        //     'Content-Security-Policy',
        //     "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
        // )
        .render('tour', {
            title: tour.name,
            tour
        });
});

exports.getLoginForm = (req, res) => {
    res
        .status(200)
        .set(
            'Content-Security-Policy',
            "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
        )
        .render('login', {
            title: 'Login',
        });
};

exports.getAccount = (req, res) => {
    res
        .status(200)
        .set(
            'Content-Security-Policy',
            "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
        )
        .render('account', {
            title: 'Your Account',
        });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
    //1. Find all bookings
    const bookings = await Booking.find({ user: req.user.id })

    //2. find tours with returned ids
    const tourIds = bookings.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIds } });

    res.status(200).render('overview', {
        title: 'My Bookings',
        tours
    })
})

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    });
    res
        .status(200)
        .set(
            'Content-Security-Policy',
            "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
        )
        .render('account', {
            title: 'Your Account',
            user: updatedUser
        });
})