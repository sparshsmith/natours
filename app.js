const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const csp = require('express-csp');
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');
const { restrictTo } = require('./controller/authController');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
/// 1. GLOBAL Middlewares

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// app.use(
//     cors({
//         origin: 'http://localhost:3000',
//         credentials: true,
//     })
// );

// // Set Security HTTP headers
// // app.use(helmet()) -> This is old helmet declartion.
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
//             baseUri: ["'self'"],
//             fontSrc: ["'self'", 'https:', 'http:', 'data:'],
//             scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
//             styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
//             connectSrc: [
//                 "'self'",
//                 'blob:',
//                 'wss:',
//                 'https://*.tiles.mapbox.com',
//                 'https://api.mapbox.com',
//                 'https://events.mapbox.com',
//                 'https://api.stripe.com',
//             ],
//         },
//     })
// );
//////////////////
app.use(helmet());
csp.extend(app, {
    policy: {
        directives: {
            'default-src': ['self'],
            'style-src': ['self', 'unsafe-inline', 'https:'],
            'font-src': ['self', 'https://fonts.gstatic.com'],
            'script-src': [
                'self',
                'unsafe-inline',
                'data',
                'blob',
                'https://js.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:8828',
                'ws://localhost:56558/',
            ],
            'worker-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                'https://*.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:*',
                'ws://localhost:*/',
            ],
            'frame-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                'https://*.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:*',
                'ws://localhost:*/',
            ],
            'img-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                'https://*.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:*',
                'ws://localhost:*/',
            ],
            'connect-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                // 'wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/',
                'https://*.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:*',
                'ws://localhost:*/',
            ],
        },
    },
});
///////////

// Developement logging
if (process.env.NODE_ENV === "development")
    app.use(morgan('dev'));

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP. Please try again in an hour'
})

app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser())

//data santization against NoSQL query injection
app.use(mongoSanitize());

//data sanization against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price'
    ]
}));

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

//// 3. Routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
});

app.use(globalErrorHandler);

module.exports = app;