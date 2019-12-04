const router = require('express').Router();
const Seance = require('../models/Seance');
const Horaire = require('../models/Horaire');
const Jour = require('../models/Jour');
const User = require('../models/User');

// function create seance
const seanceCreate = async (nbr_salle) => {
    return await Seance.create({nbr_salle});
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



// ajouter une seance
router.post("/ajouterSeance" , async function (req,res) {

    const jour =  getJour({id : req.body.idJour });




    if(!jour){
        res.status(404).json({message : 'jour not found'});
    }
    const horaire =  getHoraire({id : req.body.idHoraire});

    if(!horaire)
    {
        res.status(404).json({message : 'horaire not found'});
    }

    seanceCreate({nbr_salle: req.body.nbr_salle})
        .then(seance => {

            jour.addSeance(seance);
            horaire.addSeance(seance);



            res.status(201).json({seance , message: 'created with success'});
        })



})



module.exports = router;
