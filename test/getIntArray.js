var should = require('should');
var igo = require('../build/igo.js');

describe("getIntArray", function() {
    var buffer = [
        0x00, 0x00, 0x00, 0x01,
        0x00, 0x00, 0x00, 0x02,
        0x00, 0x00, 0x00, 0x03,
        0x00, 0x00, 0x00, 0x04,
        0xFF, 0xFF, 0xFF, 0xFF
    ];

    it('should return a igo.IntArray', function() {
        igo.getIntArray([], true).should.be.an.instanceof(igo.IntArray);
    });

    it('should parse array as little endian', function() {
        var a = igo.getIntArray(buffer, false);
        a.get(0).should.equal(0x1000000);
        a.get(1).should.equal(0x2000000);
        a.get(2).should.equal(0x3000000);
        a.get(3).should.equal(0x4000000);
        a.get(4).should.equal(-1);
        a.length.should.equal(5);
    });
    it('should parse array as big endian', function() {
        var a = igo.getIntArray(buffer, true);
        a.get(0).should.equal(0x1);
        a.get(1).should.equal(0x2);
        a.get(2).should.equal(0x3);
        a.get(3).should.equal(0x4);
        a.get(4).should.equal(-1);
        a.length.should.equal(5);
    });

});