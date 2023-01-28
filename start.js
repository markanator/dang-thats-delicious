const mongoose = require('mongoose');

// import environmental variables from our variables.env file
const dotenv = require('dotenv');
dotenv.config();

// Connect to our Database and handle any bad connections
(async () => {
    await mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    mongoose.set('strictQuery', false)
    mongoose.set('autoIndex', true)
    mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
    mongoose.connection.on('error', (err) => {
        console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
    });
}
)();

// import all models
require('./models/Store');
require('./models/User');
require('./models/Review');

// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
    console.log(
        `Express running → PORT http://localhost:${server.address().port}`
    );
});
