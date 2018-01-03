import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Config from './config';

const { port, dbHost, dbUser, dbPassword, dbPort, dbName } = Config;
const app = express();
const connection = require('express-myconnection');
const mysql = require('mysql');
const router = require('./router');

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(cors())
  .use(
  connection(mysql, {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    port: dbPort,
    database: dbName
  }, 'pool')
  );

router(app);

app.listen(port, () => {
  console.log('Perceptyx JWT login ' + port);
});
