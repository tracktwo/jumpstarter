// Simple parser for ini files. 
//
// Constructs a javascript object representing the ini file with the 
// following structure:
//
// Each directive is a property in the returned object with the name
// of the property being the name of the directive. Simple directives
// are just simple properties of int/string/bool type
//
// SOME_PROPERTY=5
//
//   {
//      'SOME_PROPERTY': 5
//   }
//
// Single directives of struct type are nested objects:
//
// SOMETHING=(iKey=5, strValue="five")
//
//   {
//       'SOMETHING': {
//           'iKey': 5,
//           'strValue': "five"
//       }
//   }
//
// Repeated directives (dynamic arrays) are stored as arrays on the 
// directive name property:
//
// ARR_VALUE="something"
// ARR_VALUE="another"
// ARR_VALUE="third"
//
//   {
//       'ARR_VALUE': [
//           "something", "another", "third"
//       ]
//   }
//
//
// The grammar is as follows:
//
// ini-file: directive-list
//
// directive-list: directive directive-list
//               | <empty>
//
// directive: IDENTIFIER = value
//
// value: INTEGER
//      | FLOAT
//      | BOOL
//      | STRING
//      | IDENTIFIER   [e.g. for enum values]
//      | ( complex-value )
//
// complex-value: directive , complex-value
//                  | <empty>

var Parser = function() {
    this.lexer = null;
    this.errors = 0;
}

Parser.prototype.init = function(lex, log) {
    this.lexer = lex;
    this.log = log;
};

Parser.prototype.parse = function() {
    var ini = {};
    do {
        var tok = this.lexer.next();

        if (tok == null) {
            // Finished parsing
            return ini;
        }

        // An INI is just a list of directives. So look for an identifier that begins a directive.
        if (tok.name == 'IDENTIFIER') {
            var dir = this._Directive(tok);
            if (dir != null) {
                // We have a valid directive. See if we've already seen
                // this key.
                if (ini.hasOwnProperty(dir.key)) {
                    // Yep, this has gotta be a dynamic array.
                    if (ini[dir.key].constructor === Array) {
                        // Yep, just this new entry
                        ini[dir.key].push(dir.value);
                    } else {
                        // Create a new array with the old value and the
                        // new one.
                        var arr = [ ini[dir.key], dir.value ];
                        ini[dir.key] = arr;
                    }
                } else {
                    // This is a brand new property.
                    ini[dir.key] = dir.value;
                }
            }
        } else {
            this._error(tok.pos, "Syntax error: expected <identifier> but got " + tok.name + "\n");
        }
    } while (true);

    if (this.errors === 0) {
        console.log(ini);
        return ini;
    } else {
        return null;
    }
};

Parser.prototype._error = function(pos, err) {
    this.log += "Error (" + pos.line + "," + pos.col + "): " + err;
    ++this.errors;
}

// Parse a directive: IDENTIFIER = value
Parser.prototype._Directive = function(tok) {
    // The next token needs to be an equals
    var next = this.lexer.next();
    if (next.name != 'EQUALS') {
        this._error(next.pos, "Syntax error: expected '=' after a directive name");
        return null;
    }
   
    // If the next token is '(' we're starting a complex-value, otherwise we have
    // a simple value that is just the next token.
    next = this.lexer.next();
    if (next.name == 'LPAREN') {
        var complexValue = this._ComplexValue(tok);
        if (complexValue == null) {
            return null;
        }
        return { key: tok.value, value: complexValue };
    } else {
        // It's just a simple directive and this token has the value. It must be a 
        // int, bool, float, string, or identifier.
        if (next.name === 'INTEGER' || next.name === 'BOOL' || next.name === 'FLOAT' || next.name === 'STRING' || next.name === 'IDENTIFIER') {
            return { key: tok.value, value: next.value };
        }
        else {
            this._error(next.pos, "Expected a number, bool, string, or enum value in a simple directive, but got " + next.value);
        }
    }
}

// complex-value ::= ( directive, directive-list )
Parser.prototype._ComplexValue = function() {
    var directives = {};

    do {
        var tok = this.lexer.next();
        if (tok.name != 'IDENTIFIER') {
            this._error(tok.pos, "Expected an identifier");
            return null;
        }
    
        var d = this._Directive(tok);
        directives[d.key] = d.value;

        tok = this.lexer.next();
        if (tok.name == 'RPAREN') {
            // we're done with this list
            return directives;
        }
        else if (tok.name != 'COMMA') {
            // We should've seen a comma or a rparen.
            this._error(tok.pos, "Expected a ',' or ')' in a complex value");
            return nullptr;
        }
        // Just continue on to read the next element
    } while (true);
}


