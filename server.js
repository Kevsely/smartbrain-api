const signin = require('./Controllers/SignIn');
const register = require('./Controllers/Register')

const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const { response } = require('express');
const db = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'kevsely',
        password: 'admin',
        database: 'smart-brain'
    }
});

const app = express();
app.use(express.json());
app.use(cors());

//REQUEST
app.get('/', (req, res) => {
    db.select('*').from('users')
    .then(data => res.json(data));
})

//Signin - POST = Success/Fail
app.post('/signin', signin.handleSignIn(db, bcrypt));

//Register - POST = user
app.post('/register', register.handleRegister(db, bcrypt))

//Profile/:userid - GET = user
app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if(user.length) res.json(user[0])
        else res.status(400).json('No such user');
    })
    .catch(err => res.status(400).json('error getting user'));
})

//Image - PUT = user
app.put('/image', (req, res) => {
    const {id} = req.body;
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        if(entries.length) res.json(entries[0])
        // else res.status(400).json('No such user'); || Useless. A non-user can't upload image
    }).catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3001, () => {
    console.log('App is running correctly on port 3001');
})