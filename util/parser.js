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
// Section names are keys with javascript objects representing the contents:
// 
// [JumpStart.JumpStart]
// START_DAY=1
// START_MONTH=3
// START_YEAR=2016
//
//   {
//      '[JumpStart.JumpStart]': {
//          'START_DAY': 1,
//          'START_MONTH': 3,
//          'START_YEAR': 2016
//       }
//   }
//
//
// The grammar is as follows:
//
// ini-file: directive-list
//
// directive-list: section-or-directive directive-list
//               | <empty>
//
// section-or-directive: directive
//                     | section
//
// section: [ section-name ]
//
// section-name: identifier
//             | identifier . section-name
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
//
// section-name: IDENTIFIER 
//             | IDENTIFIER . section-name
//

var Parser = function() {
    this.lexer = null;
    this.errors = 0;
    this.log = "";
}

Parser.prototype.init = function(lex,log) {
    this.lexer = lex;
    if (log != null) {
        this.log = log;
    }
};

Parser.prototype.parse = function() {
    this.log += "Parser.parse()\n";
    var ini = {};
    var section = null;
    do {
        var tok = this.lexer.next();

        if (tok == null) {
            // Finished parsing
            this.log += "Parser complete\n";
            return ini;
        }

        // An INI is just a list of directives or sections. So look for an identifier or '['.
        if (tok.name === 'LBRACK') {
            // Parse a section
            sec = this._Section(tok);
            if (ini.hasOwnProperty(sec)) {
                // this section already exists, just set the current section to this one.
                section = ini[sec];
            } else {
                // A new section.
                ini[sec] = {};
                section = ini[sec];
            }
        }
        else if (tok.name == 'IDENTIFIER') {
            var dir = this._Directive(tok);
            if (dir != null) {
                if (section == null) {
                    // We aren't in a section
                    this._error("Directive not inside a section");
                } else {
                    // We have a valid directive. See if we've already seen
                    // this key.
                    if (section.hasOwnProperty(dir.key)) {
                        // Yep, this has gotta be a dynamic array.
                        if (section[dir.key].constructor === Array) {
                            // Yep, just this new entry
                            section[dir.key].push(dir.value);
                        } else {
                            // Create a new array with the old value and the
                            // new one.
                            var arr = [ section[dir.key], dir.value ];
                            section[dir.key] = arr;
                        }
                    } else {
                        // This is a brand new property.
                        section[dir.key] = dir.value;
                    }
                }
            }
        } else {
            this._error(tok.pos, "Syntax error: expected <identifier> or '[' but got " + tok.name + "\n");
        }
    } while (true);

    if (this.errors === 0) {
        return ini;
    } else {
        return null;
    }
};

Parser.prototype._error = function(pos, err) {
    this.log += "Error (" + pos.line + "," + pos.col + "): " + err + "\n";
    ++this.errors;
}

// Parse a section [ section-name ]
Parser.prototype._Section = function(tok) {
    var sectionName = "[";
    var tok = this.lexer.next();

    do {
        if (tok.name === 'IDENTIFIER') {
            sectionName += tok.value;
        } else {
            this._error("Syntax error: expected identifier");
            return null; 
        }
    
        tok = this.lexer.next();
        if (tok.name === 'RBRACK') {
            // finished the section
            sectionName += ']';
            return sectionName;
        }
        else if (tok.name != 'DOT') {
            // Not a . or ], syntax error.
            this._error("Syntax error: expected '.' or ']' in a section name");
            return null;
        }
        sectionName += '.';
        // Got a dot. Read the next component and loop
        tok = this.lexer.next();
    } while(true);
}

// Parse a directive: IDENTIFIER = value or [ section-name ]
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


module.exports = Parser;
