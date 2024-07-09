const errorHandler = (err, req, res, next) => {
    console.error('Error:', err); // Log the error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }));
        return res.status(422).json({ errors });
    }
    res.status(500).json({ message: err.message });
};

module.exports = errorHandler;
