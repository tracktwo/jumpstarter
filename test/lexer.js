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

    it('parses true/false identifiers', function() {
        lexer.init('true');
        var tok = lexer.next();
        expect(tok.name).toEqual('BOOL');
        expect(tok.value).toEqual(true);
    });

    it('parses true/false identifiers', function() {
        lexer.init('false');
        var tok = lexer.next();
        expect(tok.name).toEqual('BOOL');
        expect(tok.value).toEqual(false);
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
});
        
