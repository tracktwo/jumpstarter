describe('Lexer', function() {
    var lexer;

    beforeEach(function() {
        lexer = new Lexer();
    });

    it('starts on line 1', function() {
        expect(lexer.line).toEqual(1);
    });

    it('starts on column 1', function() {
        expect(lexer.col).toEqual(1);
    });

    it ('starts at position 0', function() {
        expect(lexer.pos).toEqual(0);
    });

    it ('returns null on EOF', function() {
        lexer.init("");
        expect(lexer.next()).toEqual(null);
    });

    it ('returns a string for a string literal', function() {
        lexer.init('"hello"');
        var tok = lexer.next();
        expect(tok.name).toEqual("STRING");
        expect(tok.value).toEqual("hello");
    });

    it('skips leading whitespace', function() {
        lexer.init('    "hello"');
        var tok = lexer.next();
        expect(tok.name).toEqual("STRING");
        expect(tok.value).toEqual("hello");
        expect(tok.pos.col).toEqual(5);
    });

    it('skips ";" comments', function() {
        lexer.init(';this is a comment.\n"hello"');
        var tok = lexer.next();
        expect(tok.name).toEqual("STRING");
        expect(tok.pos.line).toEqual(2);
        expect(tok.pos.col).toEqual(1);
    });

    it('skips "#" comments', function() {
        lexer.init('#this is a comment.\n"hello"');
        var tok = lexer.next();
        expect(tok.name).toEqual("STRING");
        expect(tok.pos.line).toEqual(2);
        expect(tok.pos.col).toEqual(1);
    });

    it('strings handle escaped characters', function() {
        lexer.init('"\\"ugh\\"\\t\\n\\\\sigh"');
        var tok = lexer.next();
        expect(tok.name).toEqual("STRING");
        expect(tok.value).toEqual('"ugh"\t\n\\sigh');
    });

    it('parses true keyword', function() {
        lexer.init('true');
        var tok = lexer.next();
        expect(tok.name).toEqual('BOOL');
        expect(tok.value).toEqual(true);
    });

    it('parses false keyword', function() {
        lexer.init('false');
        var tok = lexer.next();
        expect(tok.name).toEqual('BOOL');
        expect(tok.value).toEqual(false);
    });

    it('doesn\'t consider an id starting with true to be a literal', 
        function() {
            lexer.init('truer');
            var tok = lexer.next();
            expect(tok.name).toEqual('IDENTIFIER');
            expect(tok.value).toEqual('truer');
        });

    it('parses identifiers', function() {
        lexer.init('_someId');
        var tok = lexer.next();
        expect(tok.name).toEqual('IDENTIFIER');
        expect(tok.value).toEqual("_someId");
    });

    it('parses operators', function() {
        lexer.init('(    )\n[;some stuff\n]=   \t, ');
        expect(lexer.next().name).toEqual('LPAREN');
        expect(lexer.next().name).toEqual('RPAREN');
        expect(lexer.next().name).toEqual('LBRACK');
        expect(lexer.next().name).toEqual('RBRACK');
        expect(lexer.next().name).toEqual('EQUALS');
        expect(lexer.next().name).toEqual('COMMA');
    });

    it('parses simple integers', function() {
        lexer.init('123');
        var tok = lexer.next();
        expect(tok.name).toEqual('INTEGER');
        expect(tok.value).toEqual(123);
    });

    it('parses negative numbers', function() {
        lexer.init('-3');
        var tok = lexer.next();
        expect(tok.name).toEqual('INTEGER');
        expect(tok.value).toEqual(-3);
    });

    it('parses hex numbers', function() {
            lexer.init('0xc');
            var tok = lexer.next();
            expect(tok.name).toEqual('INTEGER');
            expect(tok.value).toEqual(12);
            });

    it('handles bad negative numbers', function() {
        lexer.init('-');
        var tok = lexer.next();
        expect(tok.name).toEqual('ERROR');
    });

    it ('handles bad hex numbers', function() {
        lexer.init('0x');
        var tok = lexer.next();
        expect(tok.name).toEqual('ERROR');
    });

    it('handles float literals', function() {
        lexer.init( '1.0');
        var tok = lexer.next();
        expect(tok.name).toEqual('FLOAT');
        expect(tok.value).toEqual('1.0');
    });

    it ('splits float literals', function() {
        lexer.init('1.0.2');
        var tok = lexer.next();
        expect(tok.name).toEqual('FLOAT');
        expect(tok.value).toEqual('1.0');
    });
        
});
        
