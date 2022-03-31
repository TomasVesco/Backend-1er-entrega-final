const express = require('express');
const server = require('./src/app');

const dotenv = require('dotenv').config();
const app = express();

const PORT = 8080; // AGREGAR process.env.PORT para Glitch.com

server.listen( PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});