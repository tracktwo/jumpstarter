var express = require('express')
var multer = require('multer');
var Lexer = require('../util/lexer');
var Parser = require('../util/parser');
var router = express.Router();
var storage = multer.memoryStorage();
var upload = multer({storage: storage});


router.post('/', upload.single('inifile'), function(req, res, next) {
    var data = req.file.buffer.toString('utf8');
    console.log(data);
    var lex = new Lexer();
    var log = "";
    lex.init(data, log);
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
