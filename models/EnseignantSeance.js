
const Sequelize = require('sequelize');
const db = require('../config/database');

const EnseignantSeance = db.define('enseignant_seance', {
    nbr_heure: Sequelize.TIME
});

module.exports = EnseignantSeance;
