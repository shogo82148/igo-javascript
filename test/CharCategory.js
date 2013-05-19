var should = require('should');
var igo = require('../build/igo.js');

describe("CharCategory", function() {
    describe(".category", function() {
        it('should parse array as little endian', function() {

        });
    });

    describe(".isCompatible", function() {
        it('should parse array as little endian', function() {

        });
    });

    describe(".readCategories", function() {
        var buffer = [
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00,

            0x00, 0x00, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x02,
            0x00, 0x00, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x00,

            0x00, 0x00, 0x00, 0x02,
            0x00, 0x00, 0x00, 0x03,
            0x00, 0x00, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x01
        ];

        it('should retrun Category array', function() {
            var a = igo.CharCategory.readCategories(buffer, true);
            a.should.be.eql([
                new igo.Category(0, 0, false, false),
                new igo.Category(1, 2, true, false),
                new igo.Category(2, 3, true, true)
            ]);
        });
    });

});