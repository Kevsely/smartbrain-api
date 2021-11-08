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
app.post('/signin', (req, res) => {
    const {email, password} = req.body; 
    db.select('email', 'hash').from('login').where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid) {
            db.select('*').from('users').where('email', '=', email)
            .then(user => res.json(user[0]))
            .catch(err => res.status(400).json('Unable to get user'))
        }
        else {
            res.status(400).json('Wrong credentials'); 
        }
    })
    .catch(err => res.status(400).json('Error while logging in'))
})

//Register - POST = user
app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password); 
    
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            trx('users')
            .insert({
                email: loginEmail[0],
                name: name, 
                joined: new Date()
            })
            .returning('*')
            .then(user => res.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'));
    
})

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