var express = require('express')
var Lexer = require('../util/lexer');
var Parser = require('../util/parser');
var router = express.Router();
var bodyParser = require('body-parser');
var textParser = bodyParser.text({type: '*/*'});

router.post('/', textParser, function(req, res, next) {
    console.log(req.body);
    var lex = new Lexer();
    var log = "";
    lex.init(req.body, log);
    console.log(lex);
    var p = new Parser();
    p.init(lex, log);
    //console.log(p);
    var ini = p.parse();
    //var ini = null;
    if (ini == null || p.errors > 0) {
        res.status(200);
        res.set('Content-Type', 'text/plain');
        res.send("Error parsing ini: " + log);
    } else {
        var jsKey = '[JumpStart.JumpStart]';
        // Make sure the ini is a jumpstart INI
        if (ini.hasOwnProperty(jsKey)) {
            res.status(200);
            res.set('Content-Type', 'application/json');
            res.send(ini[jsKey]);
        } else {
            res.status(200);
            res.set('Content-Type', 'text/plain');
            res.send("INI is not a JumpStart .ini");
        }
    }
});

module.exports = router;
