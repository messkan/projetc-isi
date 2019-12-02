const Sequelize = require('sequelize');
const db = require('../config/database');

const Seance = db.define('seance' , {
   nbrSalle: {
       type: Sequelize.INTEGER
   }
})

module.exports = Seance;
