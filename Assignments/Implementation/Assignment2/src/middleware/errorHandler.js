// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).render('error', {
            title: 'Validation Error',
            error: Object.values(err.errors).map(e => e.message).join(', ')
        });
    }

    // Cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).render('error', {
            title: 'Invalid Request',
            error: 'Invalid resource identifier provided'
        });
    }

    // Default error
    res.status(err.status || 500).render('error', {
        title: 'Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
};

module.exports = errorHandler;
