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
          return  res.status(401).json({ message: 'No such user found' });
        }

        bcrypt.compare( password , user.password, (err, result) =>{
            if(err){
                 res.status(403).json({message :'incorrect password'});
            }
            if(result){
                let payload = { user   };
                console.log(jwtOptions.secretOrKey);
                let token = jwt.sign(payload, jwtOptions.secretOrKey);
               return res.status(200).json({ message: 'ok', id: user.id , nom: user.nom , prenom: user.prenom , cin: user.cin , email:user.email , role: user.role , token: token  });
            }
            else{
              return  res.status(403).json({message :'incorrect password'});
            }





        })

    }
});

//Only for test
router.post('/register', async  function(req, res, next) {


    const { email } = req.body;
       console.log(req.body.email);
    const user = await getUser({email : req.body.email});

    /**

    bcrypt.hash(req.body.password , 10 , (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
            }

        else{

            createUser({ email , password : hash , role: 'ROLE_ADMIN' }).then(user =>
                res.json({ user, msg: 'account created successfully' })
            );
        }
    }) ;*/

    bcrypt.hash(req.body.password , null , null, (err, hash) => {

        console.log(hash);
        createUser({
            email : req.body.email ,
            password : hash ,
            role: 'ROLE_ADMIN',
        }).then(user =>
            res.status(200).json({ user, msg: 'account created successfully' }) );
    })

});


module.exports = router;
