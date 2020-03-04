const router = require('express').Router();
const Grade = require('../models/Grade');

// function pour ajouter un grade
const ajouterGrade =  async ({ nom , nbr_seance }) => {
    return await Grade.create({nom , nbr_seance})
} ;

//function pour supprimer un grade
const supprimerGrade = async (obj) => {
    return await Grade.Destroy({
        where : obj
    })
}


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

    const { nom , nbr_seance } = req.body ;

    ajouterGrade({nom , nbr_seance})
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
    const { nom , nbr_seance } = req.body ;

    let grade = await findGrade({id : req.params.id});

    if(grade)

        grade.update({
            nom : req.body.nom ,
            nbr_seance: req.body.nbr_seance
        })
            .then(() => {
             return   res.status(200).json({message : 'updated'});
            })


})

//supprimer grade
router.delete('/supprimerGrade/:id', async function (req,res) {
       await supprimerGrade({id: req.params.id});

       return res.status(200).json({'message': 'deleted'});
})

module.exports = router;
