const express = require('express');
const app = express();
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
const bcrypt = require('bcrypt-nodejs');
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
Jour.hasMany(Seance , {'as' : 'Seances'});
Seance.belongsTo(Jour);
Seance.belongsTo(Horaire);
Session.hasMany(Jour, {'as' : 'Jours'});
Session.hasMany(Horaire, {'as' : 'Horaires'});
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
    .catch(() => console.log('Jour table error'));


Horaire.sync()
    .then(() => console.log('Horaire table created successfully'))
    .catch(() => console.log('Horaire table error')) ;


Seance.sync()
    .then(() => console.log('Seance table created successfully'))
    .catch(err => console.log('Seance table error'));

Grade.sync()
    .then(() => console.log('Grade table created successfully'))
    .catch(() => console.log('Grade table error'));

/*
EnseignantSeance.sync()
    .then(()=> console.log('EnseignantSeance created successfully'));
*/

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));







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
app.use('/enseignant' , enseignantRoutes);
app.use('/seance' , seanceRoutes);


module.exports = app;
