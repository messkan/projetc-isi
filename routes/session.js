const router = require('express').Router();
const Session = require('../models/Session');
const Jour = require('../models/Jour');
const Horaire = require('../models/Horaire');

// function pour ajouter une session
const ajouterSession = async ({date_deb, date_fin ,deadline}) => {
    return await Session.create({date_deb, date_fin , deadline});

}

// pour ajouter les jours de la session
const ajouterJour = async ({dateJour , name}) => {
    return await Jour.create({dateJour , name})
};

// pour ajouter un horaire
const ajouterHoraire = async ({h_debut, h_fin}) => {
    return await Horaire.create({h_debut, h_fin});

};

// function liste des sessions
const listeSession = async () => {
    return await Session.findAll();
};

// function delete session
const deleteSession = async (obj) => {
    return await Session.destroy({
      where: obj
    })
}

// details d'une session
const detailsSession = async obj => {
    return await Session.findOne({
        where: obj,
        include: [{
            model: Jour,
            'as': 'Jours',
        },
            {
                model: Horaire,
                'as': 'Horaires'
            }]
    });
};

const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];


//ajouter une session
router.post("/ajouterSession", async  function (req, res) {

    const {date_deb, date_fin, deadline} = req.body;

     const dSession = await deleteSession({});

  /* await User.update({
        complete: false
    });

     if(!validateDate(date_deb) || !validateDate(date_fin) || !validateDate(deadline) )
     return res.status(401).json({message:'date format not valid']);


    */




        ajouterSession({date_deb, date_fin, deadline})
            .then(session => {

                for (let i = new Date(date_deb); i <= new Date(date_fin); i.setDate(i.getDate() + 1)) {

                    let dateJour = new Date(i);
                    ajouterJour({dateJour: dateJour, name: days[dateJour.getDay()]})
                        .then(jour => {
                            session.addJour(jour);
                        })
                }

                for (let i = 0; i < req.body.horaire.length; i++) {
                    const {h_debut, h_fin} = req.body.horaire[i];
                    ajouterHoraire({h_debut, h_fin})
                        .then(horaire => {
                         session.addHoraire(horaire);

                        })
                }

          return   res.status(200).json({session, 'message': 'success'});
            })
    });

// details d'une session
router.get("/detailsSession/:id", function (req, res) {

    detailsSession({id: req.params.id})
        .then(session => {
            res.status(200).json(session);
        })
})

// toutes les sessions
router.get('/listeSessions', function (req, res) {

    listeSession().then(sessions => {
        res.json(sessions)
    });
})

//delete session
router.delete('/supprimerSession' , async function (req , res) {
        deleteSession({ id : req.body.id } )
            .then(() => {

               User.update({
                    complete: false
                }).then(() =>{
                   return res.status(200).json({'message' : 'deleted'})
               }) ;

            });
})

/*
function validateDate($date, $format = 'Y-m-d')
{
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) === $date;
}*/


module.exports = router;

