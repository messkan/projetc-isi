const Sequelize = require('sequelize');

// instance of Sequelize
const database = new Sequelize({
    database: 'isi_sequelize',
    username: 'root',
    password: '',
    dialect: 'mysql',
});

module.exports = database;
