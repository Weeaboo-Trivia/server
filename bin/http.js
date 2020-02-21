const http = require('../app')
const io = require('socket.io')(http)
const { Room }= require('../models')
const axios = require('axios')
let url

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
      socket.broadcast.to(payload.id).emit('someoneJoined', payload)
      socket.emit('enteredRoom', payload)
    })
  })

  socket.on('syncPlayers', (roomData) => {
    io.to(roomData.id).emit('syncRoomData', roomData)
  })

  socket.on('startGame', (roomData) => {
    io.to(roomData.id).emit('toGamePage')

  })

  socket.on('selectLevel', (payload) => {
    console.log('select level:', payload)
    url = `https://opentdb.com/api.php?amount=10&category=31&difficulty=${payload.level}&type=multiple`
    axios({
      method: 'get',
      url
    })
      .then(({ data }) => {
        console.log(data)
        let results = data.results
        results.forEach(result => {
          let answers = result.incorrect_answers
          answers.push(result.correct_answer)
          result.answers = answers
        })
        io.to(payload.id).emit('showQuestions', results)
      })
      .catch(({ response }) => {
        console.log(response)
      })
  })

  socket.on('pushAddPoint', (payload) => {
    socket.broadcast.to(payload.id).emit('addOpponentPoint', payload)
  })
  
  socket.on('endGame', (payload) => {
    io.to(payload.id).emit('endGame')
  })
})
http.listen(3000, () => {
  console.log('connect to 3000')
})