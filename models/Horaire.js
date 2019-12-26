const Sequelize = require('sequelize');
const db = require('../config/database');


const Horaire = db.define('horaire' , {
    h_debut : {
        type: Sequelize.TIME
    } ,
    h_fin : {
        type: Sequelize.TIME
    }
})

module.exports = Horaire;
