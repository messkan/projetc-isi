const Sequelize = require('sequelize');
const db = require('../config/database');

// create user model
const User = db.define('user', {

    email: {
        type: Sequelize.STRING,
    },

    password: {
        type: Sequelize.STRING,
    },
    nom :{
        type: Sequelize.STRING
    } ,
    prenom : {
        type: Sequelize.STRING
    },
    cin :{
        type: Sequelize.STRING
    },

    role : {
        type: Sequelize.STRING
    },
    complete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});


module.exports = User;
