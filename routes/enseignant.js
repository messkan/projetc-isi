const router = require('express').Router();
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/User');
const Grade = require('../models/Grade');
const Seance = require('../models/Seance');
const Sequelize = require('sequelize');

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
const updateUser = async ({nom , prenom , email , grade}) => {
    return await User.update({ nom, prenom , email  , role  })
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
                  await user.addSeance(seance);


                  if(grade.nbr_seance ===  seances.length )

                     await user.update({
                          complete: true
                      });
                  if( (seance.nbrSalle * 2 ) === enseignants.length)
                  {
                      seance.update({
                          complete: true
                      }).then(seance => {
                          return res.status(200).json({'message' : 'seance affected and completed'});
                      });
                  }

                  return res.status(200).json({'message': 'seance affected'});
              }
          }


      }

    }
    else {
        res.status(404).json({'message' : 'user not found'});
    }

})

//annuler seance
router.delete('/annulerSeance/:id' , async function (req , res) {

    const user = await getUser({'id' : req.userData.user.id}) ;
    if(seance)
    {
        user.removeSeance(seance).then( () => {
            seance.update({
               complete: false
            }).then(() => {
                return res.status(200).json({message : "seance annulé"});
            })
        });

    }else{
        return res.status(404).json({message : 'seance  not found'});
    }
})

//test
router.get("/test" , async function (req, res) {

    const Op = Sequelize.Op;
    //users
    const getEnseignants = async () => {
        return await User.findAll(
            {
             include: [
                 { model: Grade
             }
             ] ,
                where: {
                 complete: false
                }
        })
    } ;

    const getSeances = async () => {
        return await Seance.findAll({
            where: {
                complete: false
            }
        })
    } ;

    let enseignants = await getEnseignants();
    let listIncomp = await getSeances();

    enseignants.forEach( async function (item , i ){
        let grade = await item.getGrade();


            listIncomp.forEach( async function (seance, i ) {

                let listEns = await seance.getEnseignants();

                if( (seance.nbrSalle * 2 ) === listEns.length) {
                 await   seance.update({
                        complete: true
                    })
                }
                let seances = await item.getSeances();
                console.log("nbr = " + seances.length);
                if(grade.nbr_seance > seances.length){
                    await item.addSeance(seance);
                      console.log("here");


                }else{
                    await item.update({
                        complete: true
                    });
                    throw {}
                }
            })

        })
           return res.json({message : "ok"})
});


module.exports = router;
