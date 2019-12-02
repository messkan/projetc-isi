const Sequelize = require('sequelize');
const db = require('../config/database');

const Grade = db.define('grade' , {
    nom : {
        type: Sequelize.STRING
    } ,
    nbr_heure: {
        type: Sequelize.INTEGER
    }
});

module.exports = Grade ;
