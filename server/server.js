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
var Location = require('./models/location');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.post('/phone', function(request, response) {
    var phone = new Phone();
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
//5c1d67655d55185002810e7c
app.post('/account', function(request, response) {
    var account = new Account();
    account.email = request.body.email;
    account.password = request.body.password;
    account.save(function(err, savedAccount) {
       if (err) {
           response.status(500).send({error:"Could not save product"});
       } else {
           response.send(savedAccount);
       }
    });
});


app.put('/account/phone/add', function(request, response) {
   Phone.findOne({_id: request.body.phoneID}, function(err, phone) {
      // console.log(phone);
       if (err) {
           response.status(500).send(err);
       } else {
           Account.updateMany({_id:request.body.accountID}, {$addToSet:{phones: phone._id}}, function(err, account) {
              console.log(account);
               if (err) {
                   response.status(500).send({error:"Could not add item to wishlist"});
               } else {
                 response.send('success');
               }
           });
       }
   })
});

app.post('/phone/location/add', function(request, response) {
   Phone.findOne({_id: request.body.phoneID}, function(err, phone) {
     if (err)
     response.send(err)
     else
     var location = new Location();
     location.lat = request.body.lat;
     location.long = request.body.long;
     Phone.updateMany({_id:request.body.phoneID}, {$addToSet:{locations: location}}, function(err, location) {
         if (err) {
             response.status(500).send({error:"Could not add item to wishlist"});
         } else {
           response.send(phone);
         }
     });
   })
});

app.put('/account/check', function(request, response) {
   Account.findOne({_id: request.body.accountID}, function(err, account) {
     response.send(account);
   })
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
