// socket.js
const userSockets = new Map();

function setupSocket(io) {
  
  io.on('connection', (socket) => {
    console.log('🔌 Socket connected:', socket.id);

    socket.on('register', (userId) => {
      userSockets.set(userId, socket.id);
    });

    socket.on('disconnect', () => {
      for (const [userId, sid] of userSockets.entries()) {
        if (sid === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });

  io.sendNotificationToUser = (userId, data) => {
    const socketId = userSockets.get(userId);
    if (socketId) io.to(socketId).emit('notification', data);
  };
}

module.exports = { setupSocket };
