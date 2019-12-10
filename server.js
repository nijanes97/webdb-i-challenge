const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    db
        .select("*")
        .from("accounts")
        .then(accounts => {
            console.log(accounts);
            res.status(200).json(accounts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error getting the accounts' });
        });
});

server.get('/:id', (req, res) => {
    db
        .select("*")
        .from("accounts")
        .where({ id: req.params.id })
        .first()
        .then(account => {
            res.status(200).json(account);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error getting account' });
        });
});

server.post('/', (req, res) => {
    const accData = req.body;

    db("accounts")
        .insert(accData, "id")
        .then(ids => {
            const id = ids[0];
            return db("accounts")
                .select("id", "name", "budget")
                .where({ id })
                .first()
                .then(account => {
                    res.status(201).json(account);
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error adding account to db' });
        });
});

server.put('/:id', (req, res) => {
    const accData = req.body;

    db("accounts")
        .where({ id: req.params.id })
        .update(accData)
        .then(count => {
            if(count > 0) {
                res.status(200).json({ message: `${count} record(s) updated` });
            } else {
                res.status(404).json({ message: 'Account not found' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error updating account' });
        });
});

server.delete('/:id', (req, res) => {
    db('accounts')
        .where({ id: req.params.id })
        .del()
        .then(count => {
            res.status(200).json({ message: `${count} record(s) removed` })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error removing account' })
        });
});

module.exports = server;