describe('Parser', function() {
    var parser;

    beforeEach(function() {
        parser = new Parser();
    });

    it('handles a simple directive', function() {
        var lex = new Lexer();
        lex.init('[JumpStart.JumpStart]\nFOO=5');
        var log = "";
        var expectedIni = {
            '[JumpStart.JumpStart]': {
                'FOO': 5
            }
        };
        parser.init(lex, log);
        var ini = parser.parse();
        expect(parser.errors).toEqual(0);
        expect(parser.log).toEqual("");
        expect(ini).toEqual(expectedIni);
    });

    it('handles dynamic arrays of simple directives', function() {
        var lex = new Lexer();
        lex.init('[JumpStart.JumpStart]\nFOO=5\nFOO=6\nFOO=7');
        var log = "";
        parser.init(lex, log);
        var ini = parser.parse();
        expect(parser.errors).toEqual(0);
        expect(parser.log).toEqual("");
        var expectedIni = {
            '[JumpStart.JumpStart]': {
                    FOO: [ 5, 6, 7 ] 
            }
        };
        expect(ini).toEqual(expectedIni);
    });

    it('handles complex directives', function() {
        var lex = new Lexer();
        lex.init('[JumpStart.JumpStart]\nComplexType=(iValue=5,bFlag=false,strString="hello, world!",nestedObj=(iNested=1,fFloat=3.14))');
        var log = "";
        parser.init(lex, log);
        var ini = parser.parse();
        expect(parser.errors).toEqual(0);
        expect(parser.log).toEqual("");
        var expectedIni = {
            '[JumpStart.JumpStart]': {
                ComplexType: {
                    iValue: 5,
                    bFlag: false,
                    strString: "hello, world!",
                    nestedObj: {
                        iNested: 1,
                        fFloat: "3.14"
                    }
                }
            }
        };
        expect(ini).toEqual(expectedIni);
    });


});
