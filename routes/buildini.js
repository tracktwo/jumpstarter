var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var JumpStart = mongoose.model('JumpStart');

var convertToIni = function(jstart) {
  var str = "; JumpStart ini generated by JumpStarter: https://xcom.tracktwo.net/jumpstarter";
  if (jstart.title != '') {
    str += "; " + jstart.title + "\n";
  }
  if (jstart.author != '') {
    str += "; " + jstart.author + "\n";
  }

  if (jstart.startDate != '') {
    var startDate = new Date(jstart.startDate);
    str += "START_DAY=" + (startDate.getDay() + 1) + "\n";
    str += "START_MONTH=" + (startDate.getMonth() + 1) + "\n";
    str += "START_YEAR=" + (startDate.getYear() + 1) + "\n";
  }

  return str;
};

// POST / : Convert a JSON JumpStart description into
// a .INI file. Does not require authentication, does not load
// or store any database info.
router.post('/', function(req, res, next) {
  console.log("In post to /buildini!");
  console.log(req.body);
  var jstart = new JumpStart(req.body);
  var ini = convertToIni(jstart);
  res.status(200);
  res.set('Content-Type', 'text/plain');
  res.attachment();
  res.send(ini);
  //res.send("Ok there");
});

module.exports = router;

