const Sequelize = require('sequelize');
const db = require('../config/database');

// create user model
const User = db.define('user', {
    username: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    },
    role : {
        type: Sequelize.STRING
    }
});


module.exports = User;
