const express = require('express');
const bcrypt = require('bcrypt-nodejs'); //Not used yet
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

//Fake db waiting for the real one
const database = {
    users: [
        {
            id: '123',
            name: 'Jonh',
            email: 'jonh@gmail.com',
            password: 'cookies',
            entries: 0, 
            joined: new Date(), 
        },
        {
            id: '123',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0, 
            joined: new Date(), 
        }
    ]
}

//REQUEST
app.get('/', (req, res) => {
    res.json(database.users);
})

//Signin - POST = Success/Fail
app.post('/signin', (req, res) => {
    //We're just checking for the first user. 
    //We'll complete the functionnality when we'll create a database
    //Probably a relationnal database
    if(req.body.email === database.users[0].email 
        && req.body.password === database.users[0].password)
        res.json(database.users[0]);
    else
        res.status(400).json('rejected');
})

//Register - POST = user
app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    db('users')
    .insert({
        email: email,
        name: name, 
        joined: new Date()
    })
    .returning('*')
    .then(user => res.json(user[0]))
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