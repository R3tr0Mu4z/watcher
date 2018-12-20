const express = require('express')
const http = require('http')
const socketIO = require('socket.io')(http, {'pingTimeout': 7000, 'pingInterval': 3000});
const port = 5000
const app = express()
const server = http.createServer(app)
const io = socketIO.listen(server)


io.on('connection', socket => {
  console.log('New client connected')

  socket.on('yo', (color) => {
    console.log('Color Changed to: ', color)
    console.log(socket.id);
    socket.emit('yo', color)
    // socket.to(socket.id).emit('yo', color);
  })

  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
