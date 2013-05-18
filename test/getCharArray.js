var should = require('should');
var igo = require('../build/igo.js');

describe("getCharArray", function() {
    var buffer = [
        0x00, 0x01, 0x00, 0x02,
        0x00, 0x03, 0x00, 0x04,
        0xFF, 0xFF
    ];

    it('should return a igo.CharArray', function() {
        igo.getCharArray([], true).should.be.an.instanceof(igo.CharArray);
    });

    it('should parse array as little endian', function() {
        var a = igo.getCharArray(buffer, false);
        a.get(0).should.equal(0x100);
        a.get(1).should.equal(0x200);
        a.get(2).should.equal(0x300);
        a.get(3).should.equal(0x400);
        a.get(4).should.equal(0xFFFF);
        a.length.should.equal(5);
    });
    it('should parse array as big endian', function() {
        var a = igo.getCharArray(buffer, true);
        a.get(0).should.equal(0x1);
        a.get(1).should.equal(0x2);
        a.get(2).should.equal(0x3);
        a.get(3).should.equal(0x4);
        a.get(4).should.equal(0xFFFF);
        a.length.should.equal(5);
    });

});