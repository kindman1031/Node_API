import jsonwebtoken from 'jsonwebtoken';
import Config from './config';
import { authenticate, authError } from './middleware';

const express = require('express');
const weatherController = require('./controllers/weather');

const apiRoutes = express.Router();
const weatherRoutes = express.Router();
const { Client } = require('pg');
const client = new Client({
    connectionString: "postgres://rtssexxqlejgxq:483ed4cf39b88348172f5c96733670dd963c08b36970d084ea6943b263f9de14@ec2-54-243-61-173.compute-1.amazonaws.com:5432/dfjo1u1s37m18m",
    ssl: true,
});


const { secretKey } = Config;

module.exports = function (app) {
    app.get('/', (req, res) => {
        res.json({ status: 'OK' });
    });
    app.post('/login', (req, res) => {
        const { email, password } = req.body;
        client.connect();
        // You can use DB checking here
        // req.getConnection(function (err, connection) {
        client.query("SELECT * FROM users where email = '" + email + "' and password = '" + password + "'", function (err, rows) {
            if (err) throw err
            if (rows.rows[0]) {
                var token = jsonwebtoken.sign({ email: email }, secretKey);
                client.end();
                res.send({ token: token, user: req.body });
            }
            else {
                client.end();
                res.send({ error: 'Not found' });
            }
        });
        // });
    });

    app.post('/regist', (req, res) => {
        const { email, password, fullname } = req.body;

        const input = JSON.parse(JSON.stringify(req.body));

        // req.getConnection(function (err, connection) {
        const data = input;
        client.connect();
        client.query("INSERT INTO users(email, password, fullname) VALUES($1, $2, $3)", [req.body.email, req.body.password, req.body.email,], function (err, rows) {
            if (err) throw err;
            data.id = parseInt(rows.insertId);
            client.end();
            res.json(data)
        });
        // });
    });

    apiRoutes.use('/weather', weatherRoutes);
    weatherRoutes.get('/', weatherController.list);
    weatherRoutes.get('/:id', weatherController.getOne);
    weatherRoutes.put('/:id', weatherController.update);
    weatherRoutes.get('/delete/:id', weatherController.delete);
    weatherRoutes.post('/create', weatherController.save);

    // app.use('/api', authenticate, authError);
    app.use('/api', apiRoutes);

};
