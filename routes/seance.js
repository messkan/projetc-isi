const router = require('express').Router();
const Seance = require('../models/Seance');
const Horaire = require('../models/Horaire');
const Jour = require('../models/Jour');
const User = require('../models/User');

// function create seance
const seanceCreate = async ({nbrSalle }) => {
    return await Seance.create({nbrSalle });
};




// function find horaire
const getHoraire = async (obj) => {
    return  Horaire.findOne({
        where: obj
    })
};

// function find jour
const getJour = async (obj) => {
    return  await Jour.findOne({
        where : obj
    });
}

// get User
const getUser = async (obj) => {
    return await User.findOne({
        where : obj
    })
}

//liste Seances
const getSeances = async () => {
    return await Seance.findAll()
} ;


// ajouter une seance
router.post("/ajouterSeance" , async function (req,res) {

    const jour =  await getJour({id : req.body.idJour });


    if(!jour){
        return res.status(404).json({message : 'jour not found'});
    }
    const horaire =  await getHoraire({id : req.body.idHoraire});

    if(!horaire)
    {
      return  res.status(404).json({message : 'horaire not found'});
    }

    if( req.body.nbrSalle *2  < req.body.responsables.length )
        return res.status(403).json({message: 'nombre de responsable plus grand que la capacité'});

      //  console.log(req.body.nbr_salle);
    seanceCreate({nbrSalle : req.body.nbrSalle})
        .then(seance => {
            jour.addSeance(seance);
            horaire.addSeance(seance);
            
            req.body.responsables.forEach(async function (item,i ) {
                 console.log(item);
                let user = await getUser({id: item.value});

                console.log( user);
                user.addSeance(seance);
            })

           return res.status(201).json({seance , message: 'created with success'});
        })



})

// liste des seances
router.get('/listeSeance' , async function (req, res) {
    const seances = await getSeances() ;

    return res.status(200).json(seances);
})



module.exports = router;
