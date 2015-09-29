// Simple lexer for ini files.
//
// Returns a stream of token objects of the form:
// 
// { 
//    name: token-lexeme,
//    value: token-value,
//    pos: {
//        line: line number of token start,
//        col: column number of token start
//    }
// } 
// 
// token-lexeme is one of:
// LPAREN, RPAREN, LBRACK, RBRACK, COMMA, EQUALS, STRING, INTEGER, FLOAT, BOOL,
// IDENTIFIER, ERROR
//
// token-value is the value, based on the lexeme:
//  STRING - a string of the string contents
//  INTEGER - an integer with the correct value
//  FLOAT - a string of the float value (to avoid rounding errors)
//  BOOL - a bool value
//  IDENTIFIER - a string with the identifier name
//  other - The single character representing the token (e.g. '=' for EQUALS)
//
var Lexer = function() {
    this.pos = 0;
    this.col = 1;
    this.line = 1;
    this.buf = null;
    this.buflen = 0;
    this.log = console.log;
}

Lexer.prototype.init = function(str, log) {
    this.pos = 0;
    this.line = 1;
    this.col = 1;
    this.buf = str;
    this.buflen = str.length;
    this.log = log;

    this.optable = { 
        '(': 'LPAREN',
        ')': 'RPAREN',
        '[': 'LBRACK',
        ']': 'RBRACK',
        '=': 'EQUALS',
        ',': 'COMMA'
    };
};

Lexer.prototype.next = function() {
    this._skip();
    if (this.pos >= this.buflen) { 
        return null;
    }

    var c = this.buf.charAt(this.pos);

    if (this.optable.hasOwnProperty(c)) {
        // A simple one-character operand
        return { name: this.optable[c], value: c, pos: this._makePos(1) };
    }

    // Handle quoted strings.
    if (c === '"') {
        return this._stringLiteral();
    }
    // Handle numbers
    else if (c >= '0' && c <= '9') {
        return this._number();
    }
    // Handle bool literals
    // Identifier or keyword (bool literals are the only keywords)
    else if ((c >= 'a' && c <= 'z')  || (c >= 'A' && c <= 'Z') || c === '_') {
        return this._identifier();
    }
    else {
        // Unknown token
        this.log("Uknown token '" + c + "' at (" + this.line + "," + this.col + ")");
        return { name: 'ERROR', value: 'c', pos: this._makePos(1) };
    }
}

Lexer.prototype._makePos = function(len) {
    var pos = { line: this.line, col: this.col };
    this.pos += len;
    this.col += len;
    return pos;
}

Lexer.prototype._skip = function() {
    var inComment = false;
    while (this.pos < this.buflen) {
        var c = this.buf.charAt(this.pos);
        if (inComment) {
            // Inside a comment: look for the EOL
            if ( c === '\n') {
                inComment = false;
                ++this.line;
                ++this.pos;
                this.col = 1;
            } else {
                this._consume();
            }
        } else if (this._isWhiteSpace(c)) {
            // Skip whitespace
            this._consume();
        } else if (c === ';' || c === '#') {
            // Start a comment
            inComment = true;
            this._consume();
        }
        else
        {
            return;
        }
    }
}

Lexer.prototype._isWhiteSpace = function(c) {
    return (c === '\n' || c === '\r' || c === '\t' || c === '\v' || c === ' ');
};

Lexer.prototype._isIdChar = function(c) {
    return this._isIdStartChar(c) || this._isDigit(c);
}

Lexer.prototype._isIdStartChar = function(c) {
    return ((c >= 'a' && c <= 'z')  || (c >= 'A' && c <= 'Z') || c === '_');
}

Lexer.prototype._isDigit = function(c) {
    return (c >= '0' && c <= '9');
}

// Lex a string literal
Lexer.prototype._stringLiteral = function() {
    // Current character is '"'. Gather up characters until the closing quote.
    var str = "";
    var esc = false;
    var startLine = this.line;
    var startCol = this.col;

    // Step over the open "
    this._consume();

    while (this.pos < this.buflen) {
        var c = this.buf.charAt(this.pos);
        if (esc) {
            // Handle the 2nd character of the escape sequence
            switch(c) {
                case 'n': str += '\n'; break;
                case 'r': str += '\r'; break;
                case 't': str += '\t'; break;
                case '\\': str += '\\'; break;
                case '"': str += '"'; break;
                default: str += c; break;
            }
            esc = false;
        } else if (c === '\\') {
            // Enter an escape sequence
            esc = true;
        } else if (c === '"') {
            // The end!
            this._consume();
            return  { name: 'STRING', value: str, pos: {line: startLine, col: startCol} };
        } else {
            str += c;
        }
        this._consume();
    }

    // Hit the end of the stream without a closing quote
    this.log("Unterminated quote starting at (" + startLine + "," + startCol + ")");
    return { name: 'STRING', value: str, pos: {line: startLine, col: startCol} };
};

// Lex an identifier or literal
Lexer.prototype._identifier = function() {
    var str = "";
    var startLine = this.line;
    var startCol = this.col;

    while (this.pos < this.buflen) {
        var c = this.buf.charAt(this.pos);
        if (!this._isIdChar(c)) {
            break;
        }
        else {
            str += c;
            this._consume();
        }
    }
    
    if (str === 'true') {
        return { name: 'BOOL', value: true, pos: {line: startLine, col: startCol} };
    } else if (str === 'false') {
        return { name: 'BOOL', value: false, pos: {line: startLine, col: startCol} };
    } else {
        return { name: 'IDENTIFIER', value: str, pos: {line:startLine, col: startCol} };
    }
};

// Consume a character from the input stream 
Lexer.prototype._consume = function() {
    var c = this.buf.charAt(this.pos);
    if (c === '\n') {
        ++this.line;
        this.col = 1;
    } else {
        ++this.col;
    }
    ++this.pos;
}

module.exports = Lexer;
