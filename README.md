# App Chat Service

## Descrição
App de exemplo que simula os eventos de um Chat realtime. 

O projeto contém a implementação do servidor WebSockets (backend) para responder a eventos como: registrar usuário, enviar mensagens, registrar sala de bate papo e mudar de sala.

No diretório *./frontend/* arquivo *index.html* foi criada a interface básica necessária para realizar os testes do serviço. Foram utilizadas as bibliotecas do Socket.io e Jquery para frontend. As instâncias do Chat podem ser simuladas utilizando as próprias abas do Navegador.

## Tecnologias Utilizadas
  - NodeJs
  - Socket.io (Websockets)
  - Jquery
  - Mocha e Should (Testes Unitários)

## Como executar?
  - Fazer o clone do repositório em uma pasta local.
  - Executar o comando **npm install** para resolver as dependências.
  - Executar o comando **npm start**.
  - Acessar via Browser o caminho **http://localhost:3030**.
  - Informar o usuário para entrar no Chat.
  - Várias instâncias do Chat podem ser simuladas utilizando várias abas do Browser.
  - Executar o comando **npm test** para rodar os testes unitários.

## Principais Comandos
  - @nomeusuario mensagem: Envia uma mensagem pública direcionada a um usuário.
  - #nomeusuario mensagem: Envia uma mensagem privada a um usuário.
  - /sair: Fazer logoff da sala de bate papo.
