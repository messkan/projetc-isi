const router = require('express').Router();
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/User');
const Grade = require('../models/Grade');

// function creation d un  enseignant
const createUser = async ({ username, email , password, role , grade }) => {
    return await User.create({ username , email , password , role  });
};

// function get user
const getUser = async obj => {
    return await User.findOne({
        where: obj,
    });
};

// function get Grade
const getGrade = async obj => {
    return await Grade.findOne({
        where: obj
    }) ;
} ;

// function find all enseignant
const listeEnseignant = async () => {
    return await User.findAll(
        {
            where : { role :'ROLE_ENSEIGNANT'} ,
            include: [{model: Grade }]
        }
    );
}

// ajout d'un enseignant
router.post('/ajouterEnseignant', function(req, res) {



    getUser({email : req.body.email}).then(user => {
        if(user)
        return res.status(409).json({message : 'email already exists'});
    });




    bcrypt.hash(req.body.password , null , null, (err, hash) => {

         console.log(hash);
            createUser({
                nom : req.body.nom ,
                prenom : req.body.prenom ,
                email : req.body.email ,
                password : hash ,
                role: 'ROLE_ENSEIGNANT'


            }).then(user => {

                    // affecter cet enseignant à une grade
                   getGrade({id: req.body.grade})
                        .then(grade => {

                            grade.addEnseignant(user);

                            res.json({user, msg: 'account created successfully'})

                        })
 }
            );
    }) ;

});


// liste enseignant
router.get('/listeEnseignant' , function (req , res) {
     listeEnseignant()
         .then(enseignants => {
              res.json({enseignants});
         })
});




module.exports = router;
