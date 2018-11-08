const express = require('express');
const app = express();
const uuidv1 = require('uuid/v1');
const ACCESS_TOKEN = '8f347fdb89e94025b6ae9d0c28a27965';
const AI_SESSION_ID = uuidv1();

const dialogflow = require('apiai');
const ai = dialogflow(ACCESS_TOKEN);

const server = app.listen(3000, () => console.log('Server has started'));

const io = require('socket.io')(server);

io.on('connection', socket => {
  socket.emit('connected', 'Hello World!');

  socket.on('chat message', message => {
    // Get reply from AI

    console.log(message);
    let aiRequest = ai.textRequest(message.text, {
      sessionId: AI_SESSION_ID
    });

    aiRequest.on('response', response => {
      const res = response.result.fulfillment.speech;
      socket.emit('ai reply', res);
    });

    aiRequest.on('error', error => {
      console.log('error', error);
    });

    aiRequest.end();
  });
});
