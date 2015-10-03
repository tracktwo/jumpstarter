describe('Parser', function() {
    var parser;

    beforeEach(function() {
        parser = new Parser();
    });

    it('handles a simple directive', function() {
        var lex = new Lexer();
        lex.init('FOO=5');
        var log = "";
        parser.init(lex, log);
        var ini = parser.parse();
        expect(parser.errors).toEqual(0);
        expect(parser.log).toEqual("");
        expect(ini['FOO']).toEqual(5);
    });

    it('handles dynamic arrays of simple directives', function() {
        var lex = new Lexer();
        lex.init('FOO=5\nFOO=6\nFOO=7');
        var log = "";
        parser.init(lex, log);
        var ini = parser.parse();
        expect(parser.errors).toEqual(0);
        expect(parser.log).toEqual("");
        var expectedIni = {
            FOO: [ 5, 6, 7 ] 
        };
        expect(ini).toEqual(expectedIni);
    });

    it('handles complex directives', function() {
        var lex = new Lexer();
        lex.init('ComplexType=(iValue=5,bFlag=false,strString="hello, world!",nestedObj=(iNested=1,fFloat=3.14))');
        var log = "";
        parser.init(lex, log);
        var ini = parser.parse();
        expect(parser.errors).toEqual(0);
        expect(parser.log).toEqual("");
        var expectedIni = {
            ComplexType: {
                iValue: 5,
                bFlag: false,
                strString: "hello, world!",
                nestedObj: {
                    iNested: 1,
                    fFloat: "3.14"
                }
            }
        };
        expect(ini).toEqual(expectedIni);
    });
});
