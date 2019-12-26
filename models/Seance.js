const Sequelize = require('sequelize');
const db = require('../config/database');

const Seance = db.define('seance' , {
   nbrSalle: {
       type: Sequelize.INTEGER
   } ,
   complete: {
       type: Sequelize.BOOLEAN ,
       default: false
   }
})

module.exports = Seance;
