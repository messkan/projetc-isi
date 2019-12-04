const router = require('express').Router();
const Session = require('../models/Session');
const Jour = require('../models/Jour');
const Horaire = require('../models/Horaire');

// function pour ajouter une session
const ajouterSession = async ({date_deb, date_fin}) => {
    return await Session.create({date_deb, date_fin});

}

// pour ajouter les jours de la session
const ajouterJour = async ({dateJour}) => {
    return await Jour.create({dateJour})
};

// pour ajouter un horaire
const ajouterHoraire = async ({h_debut, h_fin}) => {
    return await Horaire.create({h_debut, h_fin});

};

// function liste des sessions
const listeSession = async () => {
    return await Session.findAll();
};

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


//ajouter une session
router.post("/ajouterSession", function (req, res) {

    const {date_deb, date_fin} = req.body;
    ajouterSession({date_deb, date_fin})
        .then(session => {

            for (let i = new Date(date_deb); i <= new Date(date_fin); i.setDate(i.getDate() + 1)) {

                ajouterJour({dateJour: new Date(i)})
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

            res.status(200).json({session, 'message': 'success'});
        })

});

// details d'une session
router.get("/detailsSession/:id", function (req, res) {

    detailsSession({id: req.params.id})
        .then(session => {
            res.json(session);
        })
})

// toutes les sessions
router.get('/listeSessions', function (req, res) {

    listeSession().then(sessions => {
        res.json(sessions)
    });
})


module.exports = router;

