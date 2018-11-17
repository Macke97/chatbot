const express = require('express');
const app = express();
const uuidv1 = require('uuid/v1');
const ACCESS_TOKEN = '02f025a3a6a5415f987940b4313e47af';
const AI_SESSION_ID = uuidv1();

const dialogflow = require('apiai');
const ai = dialogflow(ACCESS_TOKEN);
const port = process.env.PORT || 3001;
const server = app.listen(port, () => console.log('Server has started'));

app.use(express.static('build'));

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
