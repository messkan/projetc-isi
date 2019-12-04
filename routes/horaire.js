const router = require('express').Router();
const Horaire = require('../models/Horaire');
const Session = require('../models/Session');

//ajouter horaire
const ajouterHoraire = async ({h_debut , h_fin} ) => {
  return await   Horaire.create({h_debut , h_fin})
}

//liste horaire
const listeHoraire = async () => {
    return await Horaire.findAll()
};

// get Session
const getSession = async (obj) => {
    return await  Session.findOne({
        where: obj
    })
};





// endpoint pour ajouter les horaires
/*
router.post("/ajouterHoraire" , async function (req,res) {

    const { idSession } = req.body;
    console.log(idSession);
    let session =  await getSession({id : idSession });
    console.log(req.body.horaire.length);
    for(let i = 0 ; i< req.body.horaire.length ; i++)
    {
        const { h_debut , h_fin }  =  req.body.horaire[i];
        ajouterHoraire({h_debut , h_fin})
            .then(horaire => {
                console.log(horaire);
                session.addHoraire(horaire);

            })
    }
      res.status(200).json({session , message : "success" }) ;
} );
*/

// endpoint pour tous les horaires
router.get("/listeHoraires" , function (req, res) {
    listeHoraire()
        .then(horaires => {
            res.status(200).json({horaires})
        });

})

module.exports = router;
