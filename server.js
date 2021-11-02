const express = require('express');

const app = express();
app.use(express.json());

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
        res.json('Successfully signed in');
    else
        res.status(400).json('Error while logging in');
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

app.listen(3000, () => {
    console.log('The app is running correctly on port 3000');
})