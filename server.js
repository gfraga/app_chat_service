const express = require('express')
const http = require('http')
const path = require('path')
const chatServer = require('./chat.js')

const server = express();
server.use(express.json());
server.use(express.static('frontend'))

// Criando servidor HTTP e passando para JS chat onde o socket será instanciado
var httpServer = http.createServer(server).listen(3030, () => {
    console.log('%s escutando em %s', server.name, 3030);
});

chatServer(httpServer);

//Route get root apontando para Frontend Index.html
server.get('/', function(req, res) {
    res.sendFile('Index.html', { root: path.join(__dirname, './frontend') });
});