const http = require('../app')
const io = require('socket.io')(http)
const { Room }= require('../models')

io.on('connection', (socket) => {
  console.log('connect')
  socket.on('createRoom', (roomName) => {
    console.log('masuk create room')
    Room.create({
      name: roomName
    })
      .then(room => {
        console.log('room created')
        io.emit('roomCreated', room)
      })
  })

  socket.on('fetchRooms', () => {
    Room.findAll()
      .then(rooms => {
        socket.emit('showRooms', rooms)
      })
  })

  socket.on('joinRoom', (payload) => {
    socket.join(payload.id, () => {
      io.to(payload.id).emit('someoneJoined', payload)
    })
  })
})
http.listen(3000, () => {
  console.log('connect to 3000')
})