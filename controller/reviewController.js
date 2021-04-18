const Review = require('./../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
    // nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
}
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
// exports.deleteReview = catchAsync(async (req, res) => {
//     const review = await Review.findByIdAndDelete(req.params.id)

//     if (!review) {
//         return next(new AppError('No review found with that id!!', 404));
//     }
//     res.status(204).json({
//         status: 'success',
//         data: null
//     })
// })

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review)

exports.updateReview = factory.updateOne(Review);
