var socket = io.connect('http://localhost:3030');

socket.on('connect', function () {

    var nickname = null;
    while (!nickname || nickname === '') {
        nickname = prompt("Informe o Apelido:");
    }

    $('#nickname').text(nickname);
    var room = $('#rooms option:selected').text();
    socket.emit('registeruser', nickname, room);
});

socket.on('onRegister', function (who, data) {

    $('#chatOutPut').append('<b>' + who + ':</b> ' + data.user + ', ' + data.message + '<br>');
    $('#users').empty()
    data.userslist.forEach(fillUsers);
});

socket.on('sendMessageAllClient', function (who, data) {
    $('#chatOutPut').append('<b>' + who + ':</b> ' + data.message + '<br>');
});

socket.on('sendMessageToClient', function (who, data) {
    $('#chatOutPut').append('<b>' + who + '</b> fala para ' + '<b>' + data.userTo + ':</b>' + data.message + '<br>');
});

socket.on('sendPrivateMessageToClient', function (who, data) {
    $('#chatOutPut').append('<b>' + who + '</b> fala no privado para ' + '<b>' + data.userTo + ':</b>' + data.message + '<br>');
});

socket.on('switchRoomClient', function (who, data) {
    $('#chatOutPut').append('<b>' + who + ':</b> ' + data.message + '<br>');
});

socket.on('registerRoomClient', function (newRoom) {
    $('#rooms').append(new Option(newRoom, newRoom));
});

socket.on('disconnectUserClient', function (who, data) {
    $('#chatOutPut').append('<b>' + who + ':</b> ' + data.message + '<br>');    
});

function fillUsers(item, index) {
    $('#users').append(new Option(item, item));
}

$(function () {

    $('#send').click(function () {

        var message = $('#message').val();
        $('#message').val('');

        //Comando para desconectar do servidor
        if (message.trim() == '/sair') {                        
            socket.emit('disconnectUser');                        
            socket.disconnect();
            $('#nickname').empty();
            return;
        }

        //Verifica se existe o padrão @xxxx destinando para um usuário específico
        var sendTo = message.match(/@([a-z]|[A-Z]|[0-9])+\s/g);
        if (sendTo !== null && sendTo !== '') {

            message = message.replace(sendTo, '').trim();
            sendTo = sendTo.toString().replace('@', '').trim();

            if ($("#users option[value='" + sendTo + "']").length == 0) {
                alert('Não existe o apelido ' + sendTo + ' na sala.');
                return;
            }

            socket.emit('sendMessageTo', message, sendTo);
            return;
        }

        //Verifica se existe o padrão #xxxx para mensagem privada a um usuário
        sendTo = message.match(/#([a-z]|[A-Z]|[0-9])+\s/g);
        if (sendTo != null && sendTo != '') {

            message = message.replace(sendTo, '').trim();
            sendTo = sendTo.toString().replace('#', '').trim();

            if ($("#users option[value='" + sendTo + "']").length == 0) {
                alert('Não existe o apelido ' + sendTo + ' na sala.');
                return;
            }

            socket.emit('sendPrivateMessageTo', message, sendTo);
            return;
        }

        socket.emit('sendMessageAll', message);
    });    

    $('#message').keypress(function (event) {

        if (event.keyCode === 13) {
            event.preventDefault();
            $('#send').click();
        }
    });

    $('#room').keypress(function (event) {

        if (event.keyCode === 13) {

            event.preventDefault();
            $('#addroom').click();
        }
    });

    $('#rooms').change(function () {
        let newRoom = $('#rooms option:selected').text();
        socket.emit('switchRoom', newRoom);
    });

    $('#addroom').click(function () {
        let room = $('#room').val()
        $('#room').val('');
        if (!room || room == '') {
            alert('Informe o nome da sala!');
            return;
        }
        $('#rooms').append(new Option(room, room));
        socket.emit('registerRoom', room);
    });
});