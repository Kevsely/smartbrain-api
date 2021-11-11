const handleRegister = (db, bcrypt) => (req, res) => {
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
    
}

module.exports = {
    handleRegister: handleRegister
}