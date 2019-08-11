const socket = require('socket.io')
var connectedUsers = []
var users = {}

module.exports = (httpServer) => {

    {
        var io = socket.listen(httpServer);

        io.sockets.on('connection', function(socket) {

            socket.on('adduser', function(username, room) {

                //Controla a lista de sessões de usuários abertas
                if (connectedUsers.indexOf(username) == -1) {
                    connectedUsers.push(username);
                }

                //armazena o socket para cada sessão de usuário
                users[username] = socket;

                socket.username = username;
                socket.room = room;
                socket.join(room);

                socket.emit('onRegister', 'bot', { user: username, userslist: connectedUsers, message: ' Você entrou na sala Geral.' });
                socket.broadcast.to(room).emit('onRegister', 'bot', { user: username, userslist: connectedUsers, message: ' Entrou na sala Geral. ' });
            });

            socket.on('sendMessage', function(data) {
                io.sockets.in(socket.room).emit('sendMessageClient', socket.username, { message: data });
            });

        });
    };
}