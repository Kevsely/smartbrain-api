const signin = require('./Controllers/SignIn');
const register = require('./Controllers/Register'); 
const profile = require('./Controllers/Profile');
const image = require('./Controllers/Image');

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
app.post('/register', register.handleRegister(db, bcrypt)); 

//Profile/:userid - GET = user
app.get('/profile/:id', profile.handleProfile(db));

//Image - PUT = user
app.put('/image', image.handleImage(db));

app.listen(3001, () => {
    console.log('App is running correctly on port 3001');
})