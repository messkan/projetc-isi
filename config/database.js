const Sequelize = require('sequelize');


// instance of Sequelize
const database = new Sequelize({
    database: 'daqgf4am4gulqo',
    host : 'ec2-52-23-14-156.compute-1.amazonaws.com',
    
    username: 'bedyfsmorwvecd',
    password: '9c2bf359f7c84c40a511171efc93e285b092ac0fd78adab9a570898c02f0ab84',
    dialect: 'postgres',
});

module.exports = database;
