const e = require("express");
const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400)
}

const handleDuplicateDB = err => {
    const value = err.message.name;
    const message = `Duplicate field value : ${value}. Please use another value`;
    return new AppError(message, 400)
}

const handleValidationDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data ${errors.join('. ')}`;
    return new AppError(message, 400)
}

const handleJWTError = () => new AppError('Invalid token. Please login again!!', 401)
const handleJWTExpiredError = () => new AppError('Your token is expired. Please login again!!', 401)

const sendErrorDev = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    // Rendered website
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    })


}

const sendErrorProd = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
        // Operational Error, Trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
            // Programming or unknown error: Dont leak details to client
        }
        // 1. Log error
        console.error('ERROR ------>', err);
        //2. Send generic error
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })

    }
    // Rendered 
    if (err.isOperational) {
        // Operational Error, Trusted error: send message to client
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        })
        // Programming or unknown error: Dont leak details to client
    }
    // 1. Log error
    console.error('ERROR ------>', err);
    //2. Send generic error
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later'
    })
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV.trim() === 'development') {
        console.log("errror=================", err)
        sendErrorDev(err, req, res);
    }
    if (process.env.NODE_ENV.trim() === 'production') {
        console.log("errror=================", err)
        let error = { ...err, stack: err.stack, message: err.message, errors: err.errors };
        if (error.stack && error.stack.startsWith('CastError')) error = handleCastErrorDB(error)
        if (error.code === 11000) error = handleDuplicateDB(error);
        if (error.stack && error.stack.startsWith('ValidationError')) error = handleValidationDB(error);
        if (err.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
        sendErrorProd(error, req, res);
    }

}