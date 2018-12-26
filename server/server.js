const express = require('express')
const http = require('http')
const socketIO = require('socket.io')(http, {'pingTimeout': 7000, 'pingInterval': 3000});
const port = 5000
const app = express()
const server = http.createServer(app)
const io = socketIO.listen(server)
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://watcher:watcherpassE1@ds249092.mlab.com:49092/watcher');
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

function emailregex(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}



app.post('/push', function(request, response) {
  console.log(request.body)
  Account.updateOne({_id:request.body.accountID}, {token: request.body.token}, function(err, account) {
    if (err) {
      response.send(err)
    } else {
      response.send(account)
    }
  })
});

app.get('/phone', function(request, response) {
  Phone.findOne({_id: request.body.phoneID}, function(err, found) {
    response.send(found)
  })
});


app.get('/account', function(request, response) {
  Account.findOne({main_phone: request.body.main_phone}, function(err, found) {
    response.send(found)
  })
});


app.post('/access', function(request, response) {
  Account.updateOne({main_phone: request.body.main_phone}, {$addToSet:{requested_phones: request.body.accountID}}, function(err, account) {
    if (err) {
      response.send(err)
    } else {
      response.send(account)
    }
  })
});


io.on('connection', socket => {
  console.log('New client connected')


socket.on('coordinates', (phoneid) => {
  console.log('COORDINATES')
  var id = phoneid;
  console.log('you here');
  (async () => {
    var coords = [];
    coords['coordinates'] = [];
    coords['marker'] = [];
    await Phone.findOne({_id: id}, async function(err, phone) {
     var locations = phone.locations;
     for (var i = 0; i <= locations.length-1; i++) {
       var coord = {};
       var marker = {};
       await Location.findOne({_id: locations[i]}, async function(err, loc) {
         coord['latitude'] = loc.lat;
         coord['longitude'] = loc.long;
         marker['latitude'] = loc.lat;
         marker['longitude'] = loc.long;
         marker['status'] = loc.status;
         marker['time'] = loc.timestamp;
         marker['speed'] = loc.speed;
         coords['coordinates'].push(coord);
         coords['marker'].push(marker);
       })
     }
     console.log(coords, 'DATATATATATA')
     socket.emit('coordinates', coords.coordinates, coords.marker);
   })
  })();
})


socket.on('main', (main_phone) => {
  console.log('MAIN PHONEEEEEEE')
  Account.updateOne({_id:main_phone.accountID}, {main_phone: main_phone.phoneID}, function(err, account) {
    if (err) {
      socket.emit('main', err)
    } else {
      socket.emit('main', account)
    }
  })
})

socket.on('signup', (auth) => {
  var account = new Account();
  var resp = {}
  console.log('you here asdasd');
  account.email = auth.email;
  account.password = auth.password;
  if (emailregex(account.email)) {
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
} else if (account.email == null || account.password == null) {
    resp.id = null;
    resp.auth = null;
    resp.mess = 'Please enter email and password';
    socket.emit('signup', resp)
} else {
  resp.id = null;
  resp.auth = null;
  resp.mess = 'Invalid Email';
  socket.emit('signup', resp)
}
})

socket.on('phone', (addphone) => {
  var phone = new Phone();
  phone.title = addphone.name;
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
  location.speed = addlocation.speed;
  location.timestamp = addlocation.timestamp;
  location.status = addlocation.status;
  console.log("U HERE");
  location.save(function(err, savedLocation) {
     if (err) {
         // response.status(500).send({error:"Could not save product"});
     } else {
        // console.log(phone);
         Phone.updateOne({_id:addlocation.phoneID}, {$push:{locations: location._id}}, function(err, location) {
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
  account.email = auth.email;
  account.password = auth.password;
  if (emailregex(account.email)) {
  Account.findOne({email: account.email, password: account.password}, function(err, found) {
    console.log()
    if (isEmptyObject(found)) {
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
    } else if (account.email == null || account.password == null) {
      resp.mess = 'Please enter email and password';
      socket.emit('login', resp);
    } else {
    resp.mess = 'Invalid Email';
    socket.emit('login', resp);
  }
})

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

// async function getCoords(id) {
//    var coords = [];
//    coords['coordinates'] = [];
//    coords['marker'] = [];
//    await Phone.findOne({_id: id}, async function(err, phone) {
//     var locations = phone.locations;
//     for (var i = 0; i <= locations.length-1; i++) {
//       var coord = {};
//       var marker = {};
//       await Location.findOne({_id: locations[i]}, async function(err, loc) {
//         coord['latitude'] = loc.lat;
//         coord['longitude'] = loc.long;
//         marker['latitude'] = loc.lat;
//         marker['longitude'] = loc.long;
//         marker['status'] = loc.status;
//         marker['time'] = loc.timestamp;
//         marker['speed'] = loc.speed;
//         coords['coordinates'].push(coord);
//         coords['marker'].push(marker);
//       })
//     }
//     console.log(coords, 'Emitting these')
//     socket.emit('coordinates', coords);
//   })
// }

server.listen(port, () => console.log(`Listening on port ${port}`))
