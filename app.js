const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const User = require('./models/User');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

const passport = require('passport');

const { strategy } = require('./config/jwtOptions');


// restApi config
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

console.log('a');


// Database
const db = require('./config/database');

// Test DB
db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));
/*
User.sync()
    .then(() => console.log('User table created successfully'))
    .catch(err => console.log('oooh, did you enter wrong database credentials?'));
*/
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));










// use the strategy
passport.use(strategy);



/*
app.use( "/" ,(req, res , next) => {
    res.status(200).json({'message' : 'hello world'});
})
*/
app.use('/user', userRoutes);
app.use("/auth", authRoutes);





module.exports = app;
