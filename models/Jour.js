const Sequelize = require('sequelize');
const db = require('../config/database');


const Jour = db.define('jour', {
      dateJour : {
          type: Sequelize.DATE
      }
});


module.exports = Jour;
