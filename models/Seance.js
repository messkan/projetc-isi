const Sequelize = require('sequelize');
const db = require('../config/database');

const Seance = db.define('seance' , {
   nbrSalle: {
       type: Sequelize.INTEGER
   } ,
   complete: {
       type: Sequelize.BOOLEAN ,
       defaultValue: false
   }
})

module.exports = Seance;
