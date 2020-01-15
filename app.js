const express = require('express');
const app = express();
const schedule = require('node-schedule');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Session = require('./models/Session');
const Jour = require('./models/Jour');
const Horaire = require('./models/Horaire');
const Seance = require('./models/Seance');
const Grade = require('./models/Grade');
const EnseignantSeance = require('./models/EnseignantSeance');
const checkAuth = require('./middleware/check-auth');
const { userRoutes, authRoutes, gradeRoutes, horaireRoutes, sessionRoutes , enseignantRoutes, seanceRoutes } = require('./routes');

const passport = require('passport');
//const bcrypt = require('bcrypt-nodejs');
const { strategy } = require('./config/jwtOptions');

// restApi config
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});



// Database
const db = require('./config/database');

// Test DB
db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));


Horaire.hasMany(Seance, {'as' : 'Seances'});
Jour.hasMany(Seance , {'as' : 'Seances' , onDelete: 'cascade' , 'hooks' : true});
Seance.belongsTo(Jour );
Seance.belongsTo(Horaire);
Session.hasMany(Jour, {'as' : 'Jours' , onDelete : 'cascade' , 'hooks' : true});
Jour.belongsTo(Session);
Session.hasMany(Horaire, {'as' : 'Horaires' , onDelete: 'cascade' , 'hooks' : true});
User.belongsTo(Grade);
Grade.hasMany(User , {'as' : 'Enseignants'});


User.belongsToMany(Seance , {'as' : 'Seances' , through : EnseignantSeance});
Seance.belongsToMany(User, { 'as' : 'Enseignants' ,  through : EnseignantSeance}) ;


User.sync()
    .then(() => console.log('User table created successfully'))
    .catch(err => console.log('oooh, did you enter wrong database credentials?'));


Session.sync()
    .then(() => console.log('Session table created successfully'))
    .catch(err => console.log('Session table error'));

Jour.sync()
    .then(() => console.log('Jour table created successfully'))



Horaire.sync()
    .then(() => console.log('Horaire table created successfully'))
    .catch(() => console.log('Horaire table error')) ;


Seance.sync()
    .then(() => console.log('Seance table created successfully'))
    .catch(err => console.log('Seance table error'));

Grade.sync()
    .then(() => console.log('Grade table created successfully'))
    .catch(() => console.log('Grade table error'));

EnseignantSeance.sync()
    .then(()=> console.log('EnseignantSeance created successfully'));

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const getSession = async () => {
    return await Session.findOne();
}

let deadline ;

Session.afterCreate((session , options ) => {
    deadline = session.deadline;

       console.log("deadline = " + deadline);
       let day = deadline.getDay();
       let month = deadline.getMonth();
       let dayofmonth = deadline.getDate() ;
       let year = deadline.getUTCFullYear();
       /*
       let date = new Date(year, month , dayofmonth , 15 , 44 , 0);
       */
       let date = new Date(2019 , 11 , 27 , 19 , 40, 0 );
       //liste Seances
       const getSeances = async () => {
        return await Seance.findAll({
           where: {complete: false}
        }) ;
    } ;
       //users
    const getEnseignants = async () => {
        return await User.findAll({
            where: {
               complete : false

            },

        })
    }

    let i = schedule.scheduleJob( date , async function () {

        let enseignants = await getEnseignants();
        let listIncomp = await getSeances();

        enseignants.forEach( async function (item , i ){
            let grade = await item.getGrade();
            let seances = await item.getSeances();

            listIncomp.forEach( async function (seance, i ) {
                await item.addSeance(seance);
                let listEns = await seance.getEnseignants();

                if( (seance.nbrSalle * 2 ) === listEns.length) {
                    await   seance.update({
                        complete: true
                    })
                }

                if(grade.nbr_seance === seances.length){
                    await user.update({
                        complete: true
                    });
                    throw  {};
                }
            })

        })





    });
})






// use the strategy
passport.use(strategy);



/*
app.use( "/" ,(req, res , next) => {
    res.status(200).json({'message' : 'hello world'});
})
*/
app.use('/user', userRoutes);
app.use("/auth", authRoutes);
app.use("/grade", checkAuth,  gradeRoutes);
app.use("/horaire" , horaireRoutes);
app.use('/session' , sessionRoutes);
app.use('/enseignant', checkAuth   , enseignantRoutes);
app.use('/seance' , seanceRoutes);






module.exports = app;
