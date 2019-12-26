const router = require('express').Router();
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/User');
const Grade = require('../models/Grade');
const Seance = require('../models/Seance');


// function creation d un  enseignant
const createUser = async ({nom, prenom ,email , password, role , cin }) => {
    return await User.create({nom, prenom ,email , password, role , cin  });
};

// function get user
const getUser = async obj => {
    return await User.findOne({
        where: obj,
    });
};

// function get seance
const getSeance = async obj => {
    return await Seance.findOne({
        where: obj
    })
}

//function update User
const updateUser = async ({username, email , password, role , grade}) => {
    return await User.update({ username , email , password , role  })
}

// function get Grade
const getGrade = async obj => {
    return await Grade.findOne({
        where: obj
    }) ;
} ;

// function delete Enseignant
const deleteEnseignant = async obj => {
    return await User.destroy({
        where : obj
    })
}


// function find all enseignant
const listeEnseignant = async () => {
    return await User.findAll(
        {
            where : { role :'ROLE_ENSEIGNANT'} ,
            include: [{model: Grade  } ]
        }
    );
}

// ajout d'un enseignant
router.post('/ajouterEnseignant', async function(req, res) {



  const  user = await  getUser({email : req.body.email});
        if(user)
        return   res.status(409).json({message : 'email already exists'});





    bcrypt.hash(req.body.password , null , null, (err, hash) => {

         console.log(hash);
            createUser({
                nom : req.body.nom ,
                prenom : req.body.prenom ,
                email : req.body.email ,
                password : hash ,
                role: 'ROLE_ENSEIGNANT',
                cin: req.body.cin


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
              res.status(200).json({enseignants});
         })
});

//modifier enseignant 
router.put('/modifierEnseignant/:id' , async function (req , res ) {

    const  user = await  getUser({id : req.params.id});

        if(!user)
            return res.status(404).json({message : 'user not found'});


        user.update({
            nom : req.body.nom ,
            prenom : req.body.prenom ,
            email : req.body.email ,
            grade: req.body.grade
        })
            .then(user => {


                    // affecter cet enseignant à une grade
                    getGrade({id: req.body.grade})
                        .then(grade => {

                            grade.addEnseignant(user);

                            return res.status(200).json({message : 'success'});

                        })
            })



})

//delete enseignant
router.delete('/supprimerEnseignant/:id' , async function (req , res) {
    const  user = await  getUser({id : req.params.id});
    if(user)
    {
       deleteEnseignant({id : req.params.id})
           .then(() => {
               return res.status(200).json({'message' : 'success'})
           });
    }

})


// affecter enseignant
router.post("/affecterEnseignant",  async function (req ,res) {

    console.log(req.userData.user.id);

    const user = await getUser({'id' : req.userData.user.id}) ;

    if(user)
    {

      const grade = await user.getGrade();

      const seances = await user.getSeances();
          console.log("length =" + seances.length)
      if(grade.nbr_seance <= seances.length)
          return res.status(403).json({"message" : "nombre de seance épuisé"});

      else {

          const seance = await getSeance({'id': req.body.seance});


          if (seance) {
              const enseignants = await seance.getEnseignants();
              if(seance.nbrSalle * 2 <= enseignants.length)
              {
                  return res.status(403).json({"message" : "nombre d'enseignant epuisé"});
              }
              else {
                  user.addSeance(seance);

                  return res.status(200).json({'message': 'seance affected'});
              }
          }


      }

    }
    else {
        res.status(404).json({'message' : 'user not found'});
    }

})



module.exports = router;
