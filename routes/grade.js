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

// function find grade
const findGrade =async (obj) =>{
    return await Grade.findOne({
        where : obj
    })
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


//modifier grade
router.put('/modifierGrade/:id' , async function (req, res) {
    const { nom , nbr_heure } = req.body ;

    let grade = await findGrade({id : req.params.id});

    if(grade)

        grade.update({
            nom : req.body.nom ,
            nbr_heure: req.body.nbr_heure
        })
            .then(() => {
                res.status(200).json({message : 'updated'});
            })


})

module.exports = router;
