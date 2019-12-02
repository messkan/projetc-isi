const router = require('express').Router();

const User = require('../models/User');

const bcrypt = require('bcrypt-nodejs');

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
    const { email, password } = req.body;
    if (email && password) {
        let user = await getUser({ email: email });
        if (!user) {
            res.status(401).json({ message: 'No such user found' });
        }

        bcrypt.compare( password , user.password, (err, result) =>{
            if(err){
                return res.status(403).json({message :'incorrect password'});
            }
            if(result){
                let payload = { id: user.id , role: user.role };
                console.log(jwtOptions.secretOrKey);
                let token = jwt.sign(payload, jwtOptions.secretOrKey);
                res.status(200).json({ message: 'ok', token: token  });
            }
        })

    }
});

//Only for test
router.post('/register', function(req, res, next) {


    const { username, email } = req.body;
       console.log(req.body.email);
    const user = getUser({email : req.body.email});



    bcrypt.hash(req.body.password , 10 , (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
            }

        else{

            createUser({ username, email , password : hash , role: 'ROLE_ENSEIGNANT' }).then(user =>
                res.json({ user, msg: 'account created successfully' })
            );
        }
    }) ;

});

module.exports = router;
