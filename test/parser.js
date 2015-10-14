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
        parser.init(lex, function(v) { log += v; });
        var ini = parser.parse();
        expect(parser.errors).toEqual(0);
        expect(ini).toEqual(expectedIni);
    });

    it('handles dynamic arrays of simple directives', function() {
        var lex = new Lexer();
        lex.init('[JumpStart.JumpStart]\nFOO=5\nFOO=6\nFOO=7');
        parser.init(lex);
        var ini = parser.parse();
        expect(parser.errors).toEqual(0);
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
        parser.init(lex);
        var ini = parser.parse();
        expect(parser.errors).toEqual(0);
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
