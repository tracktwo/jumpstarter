var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var JumpStart = mongoose.model('JumpStart');

var buildHeader = function(type) {
  return ";\n; === " + type + " ===\n;\n";
};

var buildResearch = function(jstart) {
  var str = buildHeader("RESEARCH & PROJECTS");

  for (var i = 0; i < jstart.research.length; ++i) {
    console.log(jstart.research[i]);
    str += "research=" + jstart.research[i] + "\n";
  }

  for (i = 0; i < jstart.foundry.length; ++i) {
    str += "foundry=" + jstart.foundry[i] + "\n";
  }

  for (i = 0; i < jstart.ots.length; ++i) {
    str += "ots=" + jstart.ots[i] + "\n";
  }
  str += "\n";
  return str;
};

var buildFacilities = function(jstart) {
  var str = buildHeader("FACILITIES");

  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 7; ++x) {
      console.log(jstart.facilities[y][x]);
      if (jstart.facilities[y][x] != 'eFacility_None') {
        str += "facility=(iType=" + jstart.facilities[y][x] +
          ", X=" + x +
          ", Y=" + (y+1) + ")\n";
      }
    }
  }
  str += "\n";
  return str;
};

var addComponent = function(v, k, defaultVal, addComma, addQuotes) {
  var str = "";
  if (v != defaultVal) {
    if (addComma) {
      str += ", ";
    }

    str += k + "=";
    if (addQuotes) {
      str += "\"" + v + "\"";
    } else {
      str += v;
    }
  }
  return str;
};

var buildBarracks = function(jstart) {
  var str = buildHeader("BARRACKS");

  for (var i = 0; i < jstart.soldiers.length; ++i) {
    var s = jstart.soldiers[i];
    str += "soldier=(";
    str += "iRank=" + s.rank;
    str += ", iClass=" + s.class;

    str += addComponent(s.gender, "iGender", 0, true, false);
    str += addComponent(s.psiRank, "iPsiRank", 0, true, false);

    str += addComponent(s.firstName, "strfirstName", "", true, true);
    str += addComponent(s.lastName, "strLastName", "", true, true);
    str += addComponent(s.nickName, "strNickName", "", true, true);

    str += addComponent(s.hp, "iHP", 0, true, false);
    str += addComponent(s.aim, "iAim", 0, true, false);
    str += addComponent(s.mob, "iMobility", 0, true, false);
    str += addComponent(s.will, "iWill", 0, true, false);
    str += addComponent(s.defense, "iDefense", 0, true, false);

    str += s.bonusAttrib ? ", bAttribBonus=true" : ", bAttribBonus=false";

    if (s.country != "") {
      str += addComponent(s.country, "iCountry", -1, true, false);
    }

    str += ")\n";
  }

  str += "\n";
  return str;
};

var convertToIni = function(jstart) {
  var str = "; JumpStart ini generated by JumpStarter: https://xcom.tracktwo.net/jumpstarter\n";
  if (jstart.title != '') {
    str += "; " + jstart.title + '\n';
  }
  if (jstart.author != '') {
    str += "; " + jstart.author + "\n";
  }

  if (jstart.startDate != '') {
    var startDate = new Date(jstart.startDate);
    str += "START_DAY=" + String(startDate.getDate()) + "\n";
    str += "START_MONTH=" + String(startDate.getMonth() + 1) + "\n";
    str += "START_YEAR=" + String(startDate.getFullYear() + 1) + "\n";
  }

  var basicTypes = [
    { key: "slingshotDelay", value: 'SLINGSHOT_START_DAYS'},
    { key: "exaltClues", value: "EXALT_CLUE_COUNT"},
    { key: "alienResearch", value: "ALIEN_RESEARCH" },
    { key: "alienResources", value: "ALIEN_RESOURCES" },
    { key: "xcomThreat", value: "XCOM_THREAT" },
    { key: "credits", value: "CREDITS" },
    { key: "fragments", value: "FRAGMENTS" },
    { key: "alloys", value: "ALLOYS" },
    { key: "elerium", value: "ELERIUM" },
    { key: "scientists", value: "SCIENTISTS" },
    { key: "engineers", value: "ENGINEERS" },
    { key: "meld", value: "MELD" },
    { key: "randombases", value: "RANDOM_BASES"}
  ];

  basicTypes.forEach( function(elem, idx) {
    if (jstart.hasOwnProperty(elem.key) && jstart[elem.key] != -1) {
      str += elem.value + "=" + jstart[elem.key] + "\n";
    }
  });

  str += "\n";
  str += buildResearch(jstart);
  str += buildFacilities(jstart);
  str += buildBarracks(jstart);

  return str;
};

// POST / : Convert a JSON JumpStart description into
// a .INI file. Does not require authentication, does not load
// or store any database info.
router.post('/', function(req, res, next) {
  var ini = convertToIni(req.body);
  res.status(200);
  res.set('Content-Type', 'text/plain');
  res.attachment();
  res.send(ini);
});

module.exports = router;

