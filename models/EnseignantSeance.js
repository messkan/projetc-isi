
const Sequelize = require('sequelize');
const db = require('../config/database');

const EnseignantSeance = db.define('enseignant_seance', {
    responsable:{ type:  Sequelize.BOOLEAN ,
        defaultValue: false
    },

});

module.exports = EnseignantSeance;
