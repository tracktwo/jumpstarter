var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var fs = require('fs');

var User = mongoose.model('User');
var JumpStart = mongoose.model('JumpStart');

// Auth
var key = fs.readFileSync('./secret.dat');
var auth = jwt({secret: key, userProperty: 'payload'});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* JumpStart */
router.param('ini', function(req, res, next, id) {
  var query = JumpStart.findById(id);

  query.exec(function(err, ini) {
    if (err) { return next(err); }
    if (!ini) { return next(new Error('No such ini')); }

    req.ini = ini;
    return next();
  })
});

router.get('/inis', function(req, res, next) {
  JumpStart.find(function (err, inis) {
    if (err) { return next(err); }
    res.json(inis);
  });
});

router.post('/inis', auth, function(req, res, next) {
  var ini = new JumpStart(req.body);
  ini.author = req.payload.username;
  ini.save(function (err, ini) {
    if (err) { return next(err); }
    res.json(ini);
  })
});

router.get('inis/:ini', function(req, res) {
  res.json(req.ini);
});

/* Authentication */

router.post('/register', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({message: "Please fill out all fields"});
  }

  var user = new User();
  user.username = req.body.username;
  user.setPassword(req.body.password);

  user.save(function (err) {
    if (err) {
      return next(err);
    }

    return res.json({token: user.generateJWT()});
  })
});

router.post('/login', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({message: "Please fill out all fields"});
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
