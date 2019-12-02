const router = require('express').Router();
const Grade = require('../models/Grade');

// function pour ajouter un grade
const ajouterGrade =  async ({ nom , nbr_heure }) => {
    return await Grade.create({nom , nbr_heure})
} ;

// function liste des grades
const listeGrade = async () => {
    return await Grade.findAll();
}


// ajouter un nouveau grade
router.post('/ajouterGrade' , function(req, res){

    const { nom , nbr_heure } = req.body ;

    ajouterGrade({nom , nbr_heure})
       .then(grade => res.status(200).json({grade , message : 'success'}));


} );

// Liste des grades
router.get('/listeGrade' , function (req, res) {

   listeGrade().then(grades => {
       res.status(200).json(grades)
   });
})


module.exports = router;
