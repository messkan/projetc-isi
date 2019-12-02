const router = require('express').Router();
const Session = require('../models/Session');
const Jour = require('../models/Jour');

// function pour ajouter une session
const ajouterSession = async ({date_deb , date_fin}) => {
   return await Session.create({date_deb, date_fin}) ;

}

// pour ajouter les jours de la session
const ajouterJour = async ({dateJour}) => {
   return await Jour.create({dateJour})
} ;


// function liste des sessions
const listeSession = async () => {
    return await Session.findAll();
}

// details d'une session
const  detailsSession = async obj => {
    return await Session.findOne({
         where :  obj ,
        include : [ { model: Jour ,
                     'as' : 'Jours'}]
    }) ;
}


//ajouter une session
router.post("/ajouterSession" , function (req , res) {

   const {date_deb , date_fin } = req.body ;
   ajouterSession({date_deb , date_fin})
       .then(session => {

             for (let i = new Date(date_deb); i <= new Date(date_fin); i.setDate(i.getDate() + 1)) {

                ajouterJour({dateJour: new Date(i) })
                     .then(jour => {
                         session.addJour(jour);
                     })
             }



           res.json({session});
       })

});

// details d'une session
router.get("/detailsSession/:id" , function (req , res) {

    detailsSession({id : req.params.id})
        .then(session => {
            res.json(session);
        })
})

// toutes les sessions
router.get('/listeSessions' , function (req , res) {

    listeSession().then(sessions => {
        res.json(sessions)
    });
})


module.exports = router;

