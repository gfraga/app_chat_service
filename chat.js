const socket = require('socket.io')
var connectedUsers = []
var socketSessions = {}

module.exports = (httpServer) => {

    {
        var io = socket.listen(httpServer);

        io.sockets.on('connection', function(socket) {

            socket.on('registeruser', function(username, room) {

                //Controla a lista de sessões de usuários abertas
                if (connectedUsers.indexOf(username) == -1) {
                    connectedUsers.push(username);
                }

                //armazena o socket para cada sessão de usuário (Mensagem Privada)
                socketSessions[username] = socket;

                socket.username = username;
                socket.room = room;
                socket.join(room);

                socket.emit('onRegister', 'bot', { user: username, userslist: connectedUsers, message: ' Você entrou na sala ' + room + '.' });
                socket.broadcast.to(room).emit('onRegister', 'bot', { user: username, userslist: connectedUsers, message: ' Entrou na sala ' + room + '.' });
            });

            socket.on('sendMessageAll', function(data) {
                io.sockets.in(socket.room).emit('sendMessageAllClient', socket.username, { message: data });
            });

            socket.on('sendMessageTo', function(data, userDestiny) {
                io.sockets.in(socket.room).emit('sendMessageToClient', socket.username, { message: data, userTo: userDestiny });
            });

            socket.on('sendPrivateMessageTo', function(data, userDestiny) {
                socketSessions[socket.username].emit('sendPrivateMessageToClient', socket.username, { message: data, userTo: userDestiny });
                socketSessions[userDestiny].emit('sendPrivateMessageToClient', socket.username, { message: data, userTo: userDestiny });
            });

            socket.on('registerRoom', function(newroom) {
                socket.broadcast.emit('registerRoomClient', newroom);
            });

            socket.on('switchRoom', function(newroom) {

                socket.leave(socket.room);
                socket.join(newroom);

                io.sockets.in(socket.room).emit('switchRoomClient', 'bot', { message: socket.username + ' deixou a sala ' + socket.room });
                io.sockets.in(newroom).emit('switchRoomClient', 'bot', { message: socket.username + ' entrou na sala ' + newroom });
                socket.room = newroom;
            });
        });
    };
}