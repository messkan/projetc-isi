const Sequelize = require('sequelize');
const db = require('../config/database');

const Session = db.define('session' , {
    date_deb : {
        type : Sequelize.DATE
    } ,
    date_fin : {
        type: Sequelize.DATE
    }

})

module.exports = Session;
