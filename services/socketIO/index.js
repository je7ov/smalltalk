const http = require('http');
const socketIO = require('socket.io');

module.exports = app => {
  const server = http.createServer(app);
  const io = socketIO(server);
  app.io = io;

  socket.on('join', (params, callback) => {
    console.log('User joined:', socket.id);

    callback();
  });
};
socket.on('disconnect', () => {
  console.log('User left:', socket.id);
});

function isValidString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}
