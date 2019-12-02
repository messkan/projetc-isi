const Sequelize = require('sequelize');
const db = require('../config/database');


const Horaire = db.define('horaire' , {
    h_debut : {
        type: Sequelize.INTEGER
    } ,
    h_fin : {
        type: Sequelize.INTEGER
    }
})

module.exports = Horaire;
