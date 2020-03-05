const router = require('express').Router();
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/User');
const Grade = require('../models/Grade');
const Seance = require('../models/Seance');
const Jour = require('../models/Jour');
const Horaire = require('../models/Horaire');
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
                    console.log(req.body.grade); 
                   if(req.body.grade != null){
                    // affecter cet enseignant à une grade
                   getGrade({id: req.body.grade})
                        .then(grade => {

                            grade.addEnseignant(user);

                           return res.status(200).json({user, message:'created'});

                        })
                   }
                return res.json({user ,message: 'created without grade'});   
                   
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
                     await seance.update({
                          complete: true
                      });
                      return res.status(200).json({'message': 'seance affected and complete'});
                  }
                  else {
                      return res.status(200).json({'message': 'seance affected'});
                  }


              }
          } else{
              return res.status(404).json({'message' :'seance not found'});
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

//liste Seances
const getListe = async (obj) => {
    return await Seance.findAll({
        include: [{model: User ,'as' : 'Enseignants' , where: {id:obj.id}}]
    })
} ;
const getSeances = async () => {
    return await Seance.findAll({
        where: {
            complete: false
        },
        include: [
            {model: User, 'as' : 'Enseignants'}
        ]
    })
} ;

//test
router.get("/test" , async function (req, res) {

    const Op = Sequelize.Op;
    //users
    const getEnseignants = async () => {
        return await User.findAll(
            {
             include: [
                 { model: Grade
             } ,
                 {model: Seance , 'as' : 'Seances'}
             ] ,
                where: {
                 complete: false
                }
        })
    } ;



    let enseignants = await getEnseignants();
    let listIncomp = await getSeances();

   for(const item of enseignants){
        let grade = await item.getGrade();

        var BreakException = {};

          try {
              for (const seance of listIncomp) {


                  const listEns = await seance.getEnseignants();
                     console.log("length = " + listEns.length);
                  if ((seance.nbrSalle * 2) === listEns.length) {
                      await seance.update({
                          complete: true
                      })
                      continue;
                  }

                  //seances =  await item.getSeances();
                  let seances = await getListe(item);


                  console.log("asaz = " + seances.length);
                  if (grade.nbr_seance > seances.length) {
                      await seance.addEnseignant(item);

                  } else {
                      await item.update({
                          complete: true
                      });
                      throw BreakException;
                  }

              }
          }
                catch(e) {
                  if(e !==  BreakException ) throw e;
              }

        }
     return res.json({message : "ok"})
});

const fs = require('fs');
const Handlebars = require('handlebars');

function render(filename, data)
{
    let source   = fs.readFileSync(filename,'utf8').toString();
    let template = Handlebars.compile(source);
    let output = template(data);
    return output;
}



router.post('/download', async function (req ,res ) {

    let file = __dirname + '/test.html';

    const user = await getUser({'id' : req.userData.user.id}) ;
    const seances = await Seance.findAll({
        include: [ {model: Jour } , {model: Horaire} , {model:User, as: 'Enseignants', where :{id: user.id}} ]
    });
    let data = seances ;
    console.log(data);

    let o = new Object();
    for (let key in data)
    {
        if (data.hasOwnProperty(key))
        {

            let j  = data[key].jour.name;
            console.log(j);
            if(o[j] === undefined)
                o[j] = [];
            o[j].push(data[key].horaire);

        }
    }

   let y = new Object();
    y.keys = o ;

    let result = render(file,o);

    console.log(result);
    res.send(data);
})




module.exports = router;
