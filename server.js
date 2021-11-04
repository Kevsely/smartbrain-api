const express = require('express');
const bcrypt = require('bcrypt-nodejs'); //Not used yet
const cors = require('cors');

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
    if(req.body.email === database.users[0].email 
        && req.body.password === database.users[0].password)
        res.json(database.users[0]);
    else
        res.status(400).json('rejected');
})

//Register - POST = user
app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0, 
        joined: new Date(), 
    })
    res.json(database.users[database.users.length-1]);
})

//Profile/:userid - GET = user
app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if(!found)
        res.status(404).json('No such user'); 
})

//Image - PUT = user
app.put('/image', (req, res) => {
    const {id} = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if(!found) {
        res.status(404).json('No such user'); 
    }
})

app.listen(3001, () => {
    console.log('App is running correctly on port 3001');
})