const io = require('socket.io-client')
const should = require('should')
const wes_server = 'http://localhost:3030'

describe("Testes Chat Service", function() {

    it('Teste Registro de Usuário', function(done) {

        var clientSimulate = io.connect(wes_server);
        let newuser = 'gustavo';
        let room = 'geral';
        let message = 'Você entrou na sala geral.';

        clientSimulate.on('connect', function(data) {
            clientSimulate.emit('registeruser', newuser, room);
        });

        clientSimulate.on('onRegister', function(who, data) {
            who.should.equal('bot');
            data.user.should.equal(newuser);
            data.message.should.equal(message);

            clientSimulate.disconnect();
            done();
        });

    });

    it('Teste Envio Mensagem a Todos da Sala', function(done) {

        var clientSimulate = io.connect(wes_server);
        let user = 'gustavo';
        let room = 'geral';
        let message = 'A mensagem de envio para todos, funciona?';

        clientSimulate.on('connect', function(data) {
            clientSimulate.emit('registeruser', user, room);
            clientSimulate.emit('sendMessageAll', message);
        });

        clientSimulate.on('sendMessageAllClient', function(who, data) {
            data.message.should.equal(message);
            clientSimulate.disconnect();
            done();
        });

    });

    it('Teste Envio Publico para um Usuário', function(done) {

        var clientSimulate = io.connect(wes_server);
        let user = 'gustavo';
        let room = 'geral';
        let message = 'Olá. Teste mensagem publica para um usuário.';
        let userTo = 'maria';

        clientSimulate.on('connect', function(data) {
            clientSimulate.emit('registeruser', user, room);
            clientSimulate.emit('sendMessageTo', message, userTo);
        });

        clientSimulate.on('sendMessageToClient', function(who, data) {
            who.should.equal(user);
            data.userTo.should.equal(userTo);
            data.message.should.equal(message);

            clientSimulate.disconnect();
            done();
        });

    });

    it('Teste Envio Privado para um Usuário', function(done) {

        var clientSimulate = io.connect(wes_server);
        let user = 'gustavo';
        let room = 'geral';
        let message = 'Olá. Esta é uma mensagem privada.';
        let userTo = 'maria';

        clientSimulate.on('connect', function(data) {
            clientSimulate.emit('registeruser', user, room);
            clientSimulate.emit('registeruser', userTo, room);
            clientSimulate.emit('sendPrivateMessageTo', message, userTo);
        });

        clientSimulate.on('sendPrivateMessageToClient', function(who, data) {
            data.userTo.should.equal(userTo);
            data.message.should.equal(message);

            clientSimulate.disconnect();
            done();
        });

    });
});