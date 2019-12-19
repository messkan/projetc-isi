const Sequelize = require('sequelize');
const db = require('../config/database');


const Jour = db.define('jour', {
      dateJour : {
          type: Sequelize.DATE
      } ,
      name : {
          type: Sequelize.STRING
      }
});


module.exports = Jour;
