const express = require('express')
const http = require('http')
const socketIO = require('socket.io')(http, {'pingTimeout': 7000, 'pingInterval': 3000});
const port = 5000
const app = express()
const server = http.createServer(app)
const io = socketIO.listen(server)
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/realtime-tracker');
var Phone = require('./models/phone');
var Account = require('./models/account');
var Collection = require('./models/collection');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.post('/phone', function(request, response) {
    var phone = new Phone();
    console.log(request.body);
    phone.name = request.body.name;
    phone.email = request.body.email;
    phone.save(function(err, savedPhone) {
       if (err) {
           response.status(500).send({error:"Could not save product"});
       } else {
           response.send(savedPhone);
       }
    });
});

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
