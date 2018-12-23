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


function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

app.post('/account/signup', function(request, response) {
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

app.get('/account/login', function(request, response) {
      Account.findOne({email: request.body.email, password: request.body.password}, function(err, account) {
          response.send(account)
      })
});

app.put('/account/phone/add', function(request, response) {
    var phone = new Phone();
    phone.name = request.body.name;
    phone.email = request.body.email;
    console.log(request.body);
    phone.save(function(err, savedPhone) {
       if (err) {
           response.status(500).send({error:"Could not save product"});
       } else {
          console.log(phone);
           Account.updateMany({_id:request.body.accountID}, {$addToSet:{phones: phone._id}}, function(err, account) {
              console.log(account);
               if (err) {
                   response.status(500).send({error:"Could not add item to wishlist"});
               } else {
                 response.send('success');
               }
           });
       }
    });
});
//5c1d67655d55185002810e7c
app.put('/phone/location/add', function(request, response) {
    var location = new Location();
    location.lat = request.body.lat;
    location.long = request.body.long;
    console.log(location);
    location.save(function(err, savedLocation) {
       if (err) {
           response.status(500).send({error:"Could not save product"});
       } else {
          // console.log(phone);
           Phone.updateMany({_id:request.body.phoneID}, {$addToSet:{locations: location._id}}, function(err, location) {
              console.log(location);
               if (err) {
                   response.status(500).send({error:"Fail"});
               } else {
                 response.send('Success');
               }
           });
       }
    });
});



app.get('/account/check', function(request, response) {
   Account.findOne({email: request.body.email}, function(err, account) {
     if (isEmptyObject(account)) {
       console.log('not found')
       response.send('not found');
     } else {
    console.log('found')
     response.send(account);
   }
   })
});

app.get('/phone/check', function(request, response) {
   Phone.findOne({_id: request.body.phoneID}, function(err, phone) {
     console.log(phone, 'THIS IS UR PHONE')
     response.send(phone);
   })
});

app.get('/location/check', function(request, response) {
   Location.findOne({_id: request.body.locationID}, function(err, location) {
     response.send(location);
   })
});

io.on('connection', socket => {
  console.log('New client connected')


socket.on('signup', (auth) => {
  var account = new Account();
  var resp = {}
  console.log('you here');
  account.email = auth.email;
  account.password = auth.password;
  Account.findOne({email: account.email}, function(err, found) {
    if (isEmptyObject(found)) {
      account.save(function(err, savedAccount) {
         if (err) {
             console.log('fail')
             socket.emit('signup', 'Signup failed')
         } else {
             console.log(savedAccount)
             resp.id = savedAccount._id;
             resp.auth = 1;
             resp.mess = 'Account created';
             socket.emit('signup', resp)
         }
      });
    } else {
    console.log('Email already exists')
    resp.id = null;
    resp.auth = null;
    resp.mess = 'Email already exists';
    socket.emit('signup', resp);
  }
  })
})

socket.on('phone', (addphone) => {
  var phone = new Phone();
  phone.name = addphone.name;
  phone.email = addphone.email;
  phone.accountID = addphone.accountID;
  // console.log(request.body);
  phone.save(function(err, savedPhone) {
     if (err) {
     } else {
        // console.log(phone);
         Account.updateOne({_id:phone.accountID}, {$addToSet:{phones: phone._id}}, function(err, account) {
            // console.log(account);
             if (err) {
                 // response.status(500).send({error:"Could not add item to wishlist"});
             } else {
               console.log(savedPhone)
               socket.emit('phone', savedPhone)
             }
         });
     }
  });
})

socket.on('location', (addlocation) => {
  var location = new Location();
  location.lat = addlocation.lat;
  location.long = addlocation.long;
  console.log("U HERE");
  location.save(function(err, savedLocation) {
     if (err) {
         // response.status(500).send({error:"Could not save product"});
     } else {
        // console.log(phone);
         Phone.updateOne({_id:addlocation.phoneID}, {$addToSet:{locations: location._id}}, function(err, location) {
            console.log(location);
             if (err) {
                 // response.status(500).send({error:"Fail"});
             } else {
               console.log(savedLocation)
               socket.emit('phone', savedLocation)
             }
         });
     }
  }); 
})


socket.on('login', (auth) => {
  var account = new Account();
  var resp = {}
  console.log('you here');
  account.email = auth.email;
  account.password = auth.password;
  Account.findOne({email: account.email, password: account.password}, function(err, found) {
    console.log()
    if (isEmptyObject(found)) {
      resp.id = null;
      resp.auth = null;
      resp.mess = 'Email or password is incorrect';
      socket.emit('login', resp);
    } else {
    console.log('Success')
    resp.id = found._id;
    resp.auth = 1;
    resp.mess = 'Success';
    socket.emit('login', resp);
  }
  })
})

  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
