const app = require('./app');

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
