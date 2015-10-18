var express = require('express')
var multer = require('multer');
var Lexer = require('../util/lexer');
var Parser = require('../util/parser');
var router = express.Router();
var storage = multer.memoryStorage();
var upload = multer({storage: storage});


router.post('/', upload.single('inifile'), function(req, res, next) {
    var data = req.file.buffer.toString('utf8');
    var lex = new Lexer();
    lex.init(data);
    var p = new Parser();
    p.init(lex);
    try {
    var ini = p.parse();
    } catch(e) {
        console.log("caught exception " + e + " " + e.stack + ":" + e.lineNumber);
    }
    if (ini == null || p.errors > 0) {
        res.status(400);
        res.set('Content-Type', 'text/plain');
        res.send("Error parsing ini: " + p.log);
    } else {
        var jsKey = '[JumpStart.JumpStart]';
        // Make sure the ini is a jumpstart INI
        if (ini.hasOwnProperty(jsKey)) {
            res.status(200);
            res.set('Content-Type', 'application/json');
            res.send(ini[jsKey]);
        } else {
            res.status(400);
            res.set('Content-Type', 'text/plain');
            res.send("INI is not a JumpStart .ini");
        }
    }
});

module.exports = router;
