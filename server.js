const express = require('express');
const server = require('./src/app');

const dotenv = require('dotenv').config();
const app = express();

const PORT = 8080;

server.listen( PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});