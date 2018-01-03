import jsonwebtoken from 'jsonwebtoken';
import Config from './config';
import { authenticate, authError } from './middleware';

const express = require('express');
const weatherController = require('./controllers/weather');

const apiRoutes = express.Router();
const weatherRoutes = express.Router();


const { secretKey } = Config;

module.exports = function (app) {
    app.get('/', (req, res) => {
        res.json({ status: 'OK' });
    });
    app.post('/login', (req, res) => {
        const { email, password } = req.body;
        // You can use DB checking here
        req.getConnection(function (err, connection) {
            connection.query('SELECT * FROM users where email = "' + email + '" and password = "' + password + '"', function (err, rows) {
                if (err) throw err
                if (rows[0]) {
                    var token = jsonwebtoken.sign({ email: email }, secretKey);
                    res.send({ token: token, user: req.body });
                }
                else {
                    res.send({ error: 'Not found' });
                }
            });
        });
    });

    app.post('/regist', (req, res) => {
        const { email, password, fullname } = req.body;

        const input = JSON.parse(JSON.stringify(req.body));

        req.getConnection(function (err, connection) {
            const data = input;
            connection.query("INSERT INTO users set ? ", data, function (err, rows) {
                if (err) throw err;
                data.id = parseInt(rows.insertId);
                res.json(data)
            });
        });
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
