const express = require('express');
const router = express.Router();
const db = require('../config/database');
const User = require('../models/User');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const jwt = require("jsonwebtoken");
const {jwtOptions} = require('../config/jwtOptions');
const createUser = async ({ username, email , password, role }) => {
    return await User.create({ username , email , password , role });
};


const getUser = async obj => {
    return await User.findOne({
        where: obj,
    });
};



router.post('/login', async function(req, res, next) {
    const { username, password } = req.body;
    if (username && password) {
        let user = await getUser({ username: username });
        if (!user) {
            res.status(401).json({ message: 'No such user found' });
        }
        if ( user.password === password ) {
            // from now on we'll identify the user by the id and the id is the
            // only personalized value that goes into our token
            let payload = { id: user.id , role: user.role };
            console.log(jwtOptions.secretOrKey);
            let token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({ msg: 'ok', token: token  });
        } else {
            res.status(401).json({ msg: 'Password is incorrect' });
        }
    }
});

//Only for test
router.post('/registerAdmin', function(req, res, next) {

    console.log(req.body.role);
    const { username, email , password , role } = req.body;
    console.log({ username, email , password , role } );
     createUser({ username, email , password , role }).then(user =>
        res.json({ user, msg: 'account created successfully' })
    );
});

module.exports = router;
