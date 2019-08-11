var socket = io.connect('http://localhost:3030');

socket.on('connect', function() {

    var nickname = null;
    while (!nickname || nickname === '') {
        nickname = prompt("Informe o Apelido:");
    }

    $('#nickname').text(nickname);
    var room = $('#roms option:selected').text();
    socket.emit('adduser', nickname, room);
});

socket.on('onRegister', function(who, data) {

    $('#chatOutPut').append('<b>' + who + ':</b> ' + data.user + ', ' + data.message + '<br>');
    $('#users').empty()
    data.userslist.forEach(fillUsers);
});

socket.on('sendMessageClient', function(who, data) {
    $('#chatOutPut').append('<b>' + who + ':</b> ' + data.message + '<br>');
});

function fillUsers(item, index) {
    $('#users').append(new Option(item, item));
}

$(function() {

    $('#send').click(function() {

        var message = $('#message').val();
        $('#message').val('');
        socket.emit('sendMessage', message);
    });

    $('#message').keypress(function(event) {

        if (event.keyCode === 13) {

            event.preventDefault();
            $('#send').click();
        }
    });
});