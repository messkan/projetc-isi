const express = require('express');
const router = express.Router();
const db = require('../config/database');
const User = require('../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



const getAllUsers = async () => {
    return await User.findAll();
};





router.get('/users', function(req, res) {
    getAllUsers().then(user => res.json(user));
});

module.exports = router;


