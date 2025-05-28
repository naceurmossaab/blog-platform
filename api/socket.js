const userSockets = new Map();

function setupSocket(io) {

  io.on('connection', (socket) => {
    console.log('✅ Socket connected with ID:', socket.id);

    socket.on('connection_error', (err) => {
      console.error('❌ Connection error:', err.message);
    });

    socket.on('register', (userId) => {
      userSockets.set(userId, socket.id);
      console.log(`📌 User ${userId} registered with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      for (const [userId, sid] of userSockets.entries()) {
        if (sid === socket.id) {
          userSockets.delete(userId);
          console.log(`❌ User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  io.sendNotificationToUser = (userId, data) => {
    const socketId = userSockets.get(userId);
    if (socketId) {
      io.to(socketId).emit('notification', data);
    }
  };
}

module.exports = { setupSocket };
