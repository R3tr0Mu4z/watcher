const express = require('express');
const http = require('http');
const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const nodemailer = require("nodemailer");
const crypto = require('crypto');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://*****');
var Phone = require('./models/phone');
var Account = require('./models/account');
var Location = require('./models/location');
var fetch = require('isomorphic-fetch');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const EXPO_PUSH = 'https://exp.host/--/api/v2/push/send';
const timeoutPromise = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));
var key = "******";

//Check key
function checkckey(value,key) {
    if (value == key) {
        return true;
    } else {
        return false;
    }
}

//Check if empty
function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

//Email Regex
function emailregex(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//Password Regex
function passRegex(pass) {
    var re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(pass);
}

//Add expo token
app.post('/push', function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    Account.updateOne({_id:request.body.accountID}, {token: request.body.token}, function(err, account) {
        if (err) {
            response.send(err)
        } else {
            response.send(account)
        }
    })
});

app.get('/phone', function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    Account.findOne({main_phone: request.body.phoneID}, function(err, found) {
        response.send(found)
    })
});

//Phones
app.post('/phones', async function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    await Account.findOne({_id: request.body.ID}, async function(err, found) {
        var phones = [];
        for (var phone of found.phones) {
            var phn = {};
            await Phone.findOne({_id: phone._id}, async function(err, found) {
                phn.name = found.title;
                phn.id = found._id;
            });
            await Account.findOne({main_phone: phone._id}, async function(err, found) {
                phn.user = found.name;
            });
            phones.push(phn);
        }
        await timeoutPromise(2000);
        response.send(phones);
    })
});

//Pending requests
app.post('/requested-phones', function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    Account.findOne({_id: request.body.accountID}, async function(err, found) {
        var phones = [];
        var length = found.requested_phones.length;
        for (var rp of found.requested_phones) {
            var phone = {};
            await Account.findOne({_id: rp}, async function(err, requested_phone) {
                phone.name = requested_phone.name;
                phone._id = requested_phone._id;
                phones.push(phone)
            })
        }
        await timeoutPromise(10000);
        response.send(phones)
    })
});


app.get('/account', function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    Account.findOne({_id: request.body.ID}, function(err, found) {
        response.send(found)
    })
});

//Registration
app.post('/registration', function(request, response) {
    var resp = {};
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    if (request.body.email == null || request.body.password == null || request.body.name == null) {
        resp.id = null;
        resp.auth = null;
        resp.mess = 'Name, Email or Password can not be empty';
        response.send(resp);
        return;
    }
    var account = new Account();
    account.name = request.body.name;
    account.email = request.body.email;
    account.password = request.body.password;
    account.password = crypto.createHash('md5').update(account.password).digest('hex');
    if (emailregex(account.email)) {
        Account.findOne({email: account.email}, function(err, found) {
            if (isEmptyObject(found)) {
                if (passRegex(request.body.password)) {
                    account.save(function(err, savedAccount) {
                        if (err) {
                            resp.mess = 'Fail';
                            response.send(resp)
                            return;
                        } else {
                            resp.id = savedAccount._id;
                            resp.auth = 1;
                            resp.mess = 'Account created';
                            response.send(resp)
                        }
                    });
                } else {
                    resp.id = null;
                    resp.auth = null;
                    resp.mess = 'Password must contain minimum eight characters, at least one letter and one number';
                    response.send(resp);
                    return;
                }
            } else {
                resp.id = null;
                resp.auth = null;
                resp.mess = 'Email already exists';
                response.send(resp);
                return;
            }
        })
    } else if (account.email == null || account.password == null) {
        resp.id = null;
        resp.auth = null;
        resp.mess = 'Please enter email and password';
        response.send(resp)
        return;
    } else {
        resp.id = null;
        resp.auth = null;
        resp.mess = 'Invalid Email';
        response.send(resp)
        return;
    }
});

//Login
app.post('/login', function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    var resp = {};
    var password = request.body.password;
    var email = request.body.email;
    if (email == null || password == null) {
        resp.id = null;
        resp.auth = null;
        resp.mess = 'Please enter email and password';
        response.send(resp);
    }
    password = crypto.createHash('md5').update(request.body.password).digest('hex');
    if (emailregex(email)) {
        Account.findOne({email: email, password: password}, function(err, found) {
            if (isEmptyObject(found)) {
                resp.id = null;
                resp.auth = null;
                resp.mess = 'Email or password is incorrect';
                response.send(resp);
                return;
            } else {
                resp.id = found._id;
                resp.auth = 1;
                resp.mess = 'Success';
                response.send(resp);
            }
        })
    }  else {
        resp.id = null;
        resp.auth = null;
        resp.mess = 'Invalid Email or password';
        response.send(resp);
        return;
    }
})

//Add Phone
app.post('/phone', function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    var phone = new Phone();
    phone.title = request.body.name;
    phone.accountID = request.body.accountID;
    phone.save(function(err, savedPhone) {
        if (err) {
        } else {
            Account.updateOne({_id:phone.accountID}, {$addToSet:{phones: phone._id}}, function(err, account) {
                if (err) {
                } else {
                    response.send(savedPhone)
                }
            });
        }
    });
});

//Set main phone
app.post('/main-phone', function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    Account.updateOne({_id:request.body.accountID}, {main_phone: request.body.phoneID}, function(err, account) {
        if (err) {
            response.send(err)
        } else {
            response.send(account)
        }
    })
})

//Set Status
app.post('/location', function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
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

//Get coordinates
app.post('/coordinates', async function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
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
    })
})

//Request Access
app.post('/requestaccess', async function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    if (request.body.phoneID == null) {
        var res = {};
        res.stat = 'Invalid phone';
        response.send(res)
        return;
    }
    Account.findOne({main_phone: request.body.phoneID}, function(err, account) {
        if (err) {
            var res = {};
            res.stat = 'Invalid phone';
            response.send(res)
        } else {
            if (isEmptyObject(account) !== true){
                fetch(EXPO_PUSH, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: account.token,
                        body: account.name+" is Requesting access",
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
                    var res = {};
                    res.stat = 'Request sent';
                    response.send(res)
                }
            })
        }
    })

})

//Request Update
app.post('/requestupdate', async function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    Account.findOne({main_phone: request.body.phoneID}, function(err, account) {
        if (err) {
            var res = {};
            res.stat = 'Invalid phone';
            response.send(res)
        } else {
            if (isEmptyObject(account) !== true){
                Account.findOne({main_phone: request.body.sphoneID}, function(err, saccount) {
                    fetch(EXPO_PUSH, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            to: account.token,
                            body: saccount.name + " is requesting location update",
                            data: {
                                request: "REQUEST_UPDATE",
                            }
                        })

                    }).then(response => response.send(response))
                });
            }
        }
    })
})

app.post('/access', function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    Account.updateOne({main_phone: request.body.main_phone}, {$addToSet:{requested_phones: request.body.accountID}}, function(err, account) {
        if (err) {
            response.send(err)
        } else {ori
            response.send(account)
        }
    })
});

//Enable access
app.post('/enable', async function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    Account.updateOne({_id: request.body.recaccountID}, {$addToSet:{phones: request.body.phoneID}}, function(err, account) {

    })
    Account.updateOne({_id: request.body.senaccountID}, {$pull:{requested_phones: request.body.recaccountID}},  function(err, found) {
        var res = {};
        res.stat = 1;
        response.send(res);
    })
});



//Reset Password
app.post('/reset', async function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    var res = {};
    if (request.body.email == null) {
        res.mess = 'Please provide an email';
        response.send(res);
        return;
    }  else if (!emailregex(request.body.email)) {
        res.mess = 'Invalid email';
        response.send(res);
        return;
    } else {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        hash = crypto.createHash('md5').update(text).digest('hex');
        Account.updateOne({email:request.body.email}, {password: hash},async function(err, account) {
            let transporter = nodemailer.createTransport({
                host: "*****",
                port: 465,
                secure: true,
                auth: {
                    user: '*****',
                    pass: '*****'
                }
            });

            let mailOptions = {
                from: '"Watcher" <info@r3tr0.tech>',
                to: request.body.email,
                subject: "Reset Password",
                text: "Your Watcher password has been set to "+text
            };

            let info = await transporter.sendMail(mailOptions)
            var res = {};
            res.mess = 'Please check your email';
            response.send(res);
            console.log("Message sent: %s"+request.body.email);

        })
    }



});

//Change Password
app.post('/changepass', async function(request, response) {
    if (!checkckey(request.body.secretkey, key)) { console.log('incorrect key ' +request.body.secretkey); return};
    var resp = {};
    var password = request.body.password;
    var current = request.body.current;
    if (current == null || password == null) {
        resp.mess = "Current or New password can not be empty";
        response.send(resp);
        return;
    } else if (current == password) {
        resp.mess = "Current & New password can not be same";
        response.send(resp);
        return;
    }
    hash = crypto.createHash('md5').update(current).digest('hex');
    Account.findOne({_id: request.body.id, password: hash}, function(err, found) {
        if (isEmptyObject(found)) {
            resp.mess = 'Your current password is incorrect';
            response.send(resp);
        } else {
            hash = crypto.createHash('md5').update(password).digest('hex');
            Account.updateOne({_id:request.body.id}, {password: hash},async function(err, account) {
                resp.mess = 'Your password has been changed';
                response.send(resp);
            })
        }
    })

});

server.listen(port, () => console.log(`Listening on port ${port}`))
