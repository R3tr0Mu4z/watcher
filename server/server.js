const express = require('express')
const http = require('http')
const port = 5000
const app = express()
const server = http.createServer(app)
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://watcher:watcherpassE1@ds249092.mlab.com:49092/watcher');
var Phone = require('./models/phone');
var Account = require('./models/account');
var Location = require('./models/location');
var fetch = require('isomorphic-fetch');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const EXPO_PUSH = 'https://exp.host/--/api/v2/push/send';
const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

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
  Account.findOne({main_phone: request.body.phoneID}, function(err, found) {
    response.send(found)
  })
});


app.get('/account', function(request, response) {
  Account.findOne({_id: request.body.ID}, function(err, found) {
    response.send(found)
  })
});

app.post('/registration', function(request, response) {
  var account = new Account();
  var resp = {}
  console.log('you here asdasd');
  account.name = request.body.name;
  account.email = request.body.email;
  account.password = request.body.password;
  if (emailregex(account.email)) {
  Account.findOne({email: account.email}, function(err, found) {
    if (isEmptyObject(found)) {
      account.save(function(err, savedAccount) {
         if (err) {
             console.log('fail')
             response.send('Signup failed')
         } else {
             console.log(savedAccount)
             resp.id = savedAccount._id;
             resp.auth = 1;
             resp.mess = 'Account created';
             response.send(resp)
         }
      });
    } else {
    console.log('Email already exists')
    resp.id = null;
    resp.auth = null;
    resp.mess = 'Email already exists';
    response.send(resp);
  }
  })
} else if (account.email == null || account.password == null) {
    resp.id = null;
    resp.auth = null;
    resp.mess = 'Please enter email and password';
    response.send(resp)
} else {
  resp.id = null;
  resp.auth = null;
  resp.mess = 'Invalid Email';
  response.send(response)
}
});

app.post('/login', function(request, response) {
  var account = new Account();
  var resp = {}
  account.email = request.body.email;
  account.password = request.body.password;
  if (emailregex(account.email)) {
  Account.findOne({email: account.email, password: account.password}, function(err, found) {
    console.log()
    if (isEmptyObject(found)) {
      resp.mess = 'Email or password is incorrect';
      response.send(resp);
    } else {
      console.log('Success')
      resp.id = found._id;
      resp.auth = 1;
      resp.mess = 'Success';
      response.send(resp);
    }
    })
    } else if (account.email == null || account.password == null) {
      resp.mess = 'Please enter email and password';
      response.send(resp);
    } else {
    resp.mess = 'Invalid Email';
    response.send(resp);
  }
})

app.post('/phone', function(request, response) {
  var phone = new Phone();
  phone.title = request.body.name;
  phone.accountID = request.body.accountID;
  phone.save(function(err, savedPhone) {
     if (err) {
     } else {
         Account.updateOne({_id:phone.accountID}, {$addToSet:{phones: phone._id}}, function(err, account) {
             if (err) {
             } else {
               console.log(savedPhone)
               response.send(savedPhone)
             }
         });
     }
  });
});

app.post('/main-phone', function(request, response) {
  Account.updateOne({_id:request.body.accountID}, {main_phone: request.body.phoneID}, function(err, account) {
    if (err) {
      response.send(err)
    } else {
      response.send(account)
    }
  })
})

app.post('/location', function(request, response) {
  var location = new Location();
  location.lat = request.body.lat;
  location.long = request.body.long;
  location.speed = request.body.speed;
  location.timestamp = request.body.timestamp;
  location.status = request.body.status;
  location.save(function(err, savedLocation) {
     if (err) {
         response.send(err)
     } else {
         Phone.updateOne({_id:request.body.phoneID}, {$push:{locations: location._id}}, function(err, location) {
             if (err) {
             } else {
               response.send(savedLocation)
             }
         });
     }
  });
})


app.post('/coordinates', async function(request, response) {
    var coords = [];
    coords['coordinates'] = [];
    coords['marker'] = [];
    await Phone.findOne({_id: request.body.phoneid}, async function(err, phone) {
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
         await timeoutPromise(1000);
       })
     }
     var data = {}
     data.markers = coords.marker;
     data.coordinates = coords.coordinates;
     response.send(data)
     console.log('sent')
   })
})

app.post('/requestaccess', async function(request, response) {
  if (request.body.phoneID == null) {
    console.log('phone id is null')
    response.send('Please enter a Phone ID')
    return;
  }
 Account.findOne({main_phone: request.body.phoneID}, function(err, account) {
   console.log('gettoken')
    if (err) {
      response.send('invalid phone')
    } else {
      if (isEmptyObject(account) !== true) {
      console.log(account.token , ' < --- sending')
      console.log(account._id, ' < ---- account')
      fetch(EXPO_PUSH, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: account.token,
        body: "Requesting access",
        data: {
          request: "REQUEST_PHONE",
          accountID: account.accountID
        }
      })

    }).then(response => console.log(response))

    }
  }
  if (isEmptyObject(account) !== true) {
    Account.updateOne({_id: account._id}, {$addToSet:{requested_phones: request.body.accountID}}, function(err, account) {
      if (err) {
      } else {
        response.send('Request Sent')
      }
    })
  }
  })

})






app.post('/access', function(request, response) {
  Account.updateOne({main_phone: request.body.main_phone}, {$addToSet:{requested_phones: request.body.accountID}}, function(err, account) {
    if (err) {
      response.send(err)
    } else {
      response.send(account)
    }
  })
});

app.get('/requested', async function(request, response) {
  await Account.findOne({_id: request.body.accountID}, async function(err, found) {
    var phones = [];
    var length = found.requested_phones.length;
    for (var rp of found.requested_phones) {
      console.log(rp)
      var phone = {};
      await Account.findOne({_id: rp}, async function(err, requested_phone) {
        phone.name = requested_phone.email;
        phone._id = requested_phone._id;
        phones.push(phone)
        console.log(phone)
      })
    }
    await timeoutPromise(10000);
    response.send(phones)
  })
});

app.post('/enable', async function(request, response) {
  Account.updateOne({_id: request.body.recaccountID}, {$addToSet:{phones: request.body.phoneID}}, function(err, account) {

  })
  Account.updateOne({_id: request.body.senaccountID}, {$pull:{requested_phones: request.body.recaccountID}},  function(err, found) {
    response.send(err)
  })
});


server.listen(port, () => console.log(`Listening on port ${port}`))
