const errorHandler = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }));
        return res.status(422).json({ errors });
    }
    if (err.name === 'DuplicateKeyError') {
        const field = Object.keys(err.keyValue)[0];
        const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already in use`;
        return res.status(422).json({ errors: [{ field, message }] });
    }
    res.status(500).json({ message: err.message });
};

module.exports = errorHandler;
