var should = require('should');
var igo = require('../build/igo.js');
var fs = require('fs');

const ALPHA = 0;
const CYRILLIC = 1;
const DEFAULT = 2;
const GREEK = 3;
const HIRAGANA = 4;
const KANJI = 5;
const KANJINUMERIC = 6;
const KATAKANA = 7;
const NUMERIC = 8
const SPACE = 9;
const SYMBOL = 10;


describe("CharCategory", function() {
    var category;

    before(function() {
        var code2category = fs.readFileSync('./ipadic/code2category');
        var charcategory = fs.readFileSync('./ipadic/char.category');
        category = new igo.CharCategory(code2category, charcategory);
    });
    describe(".category", function() {
        it('should return ALPHA', function() {
            category.category('A').id.should.equal(ALPHA);
            category.category('Z').id.should.equal(ALPHA);
            category.category('a').id.should.equal(ALPHA);
            category.category('z').id.should.equal(ALPHA);
        });

        it('should return KANJINUMERIC', function() {
            category.category('一').id.should.equal(KANJINUMERIC);
            category.category('二').id.should.equal(KANJINUMERIC);
            category.category('三').id.should.equal(KANJINUMERIC);
        });

        it('should return NUMERIC', function() {
            category.category('0').id.should.equal(NUMERIC);
            category.category('9').id.should.equal(NUMERIC);
        });

        it('should return SPACE', function() {
            category.category(' ').id.should.equal(SPACE);
            category.category('\v').id.should.equal(SPACE);
            category.category('\t').id.should.equal(SPACE);
            category.category('\n').id.should.equal(SPACE);
        });

        it('should return SYMBOL', function() {
            category.category('!').id.should.equal(SYMBOL);
            category.category('/').id.should.equal(SYMBOL);
        });

    });

    describe(".isCompatible", function() {
        it('should parse array as little endian', function() {
        });
    });

    describe(".categories", function() {
        it('should be Category array', function() {
            // categories are sorted by key defined in char.def
            category.categories.should.be.eql([
                new igo.Category(ALPHA, 0, true, true),
                new igo.Category(CYRILLIC, 0, true, true),
                new igo.Category(DEFAULT, 0, false, true),
                new igo.Category(GREEK, 0, true, true),
                new igo.Category(HIRAGANA, 2, false, true),
                new igo.Category(KANJI, 2, false, false),
                new igo.Category(KANJINUMERIC, 0, true, true),
                new igo.Category(KATAKANA, 2, true, true),
                new igo.Category(NUMERIC, 0, true, true),
                new igo.Category(SPACE, 0, false, true),
                new igo.Category(SYMBOL, 0, true, true)
            ]);
        });
    });

});