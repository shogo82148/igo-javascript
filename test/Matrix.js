var should = require('should');
var igo = require('../build/igo.js');


describe("Matrix", function() {
    var buf = [
        0x00, 0x00, 0x00, 0x02,  0x00, 0x00, 0x00, 0x03,
        0x00, 0x01,  0x00, 0x02,
        0x00, 0x03,  0x00, 0x04,
        0x00, 0x05,  0x00, 0x06
    ];
    var matrix;

    before(function() {
        matrix = new igo.Matrix(buf, true);
    });

    describe(".linkCost", function() {
        it('should return short integer', function() {
            matrix.linkCost(0, 0).should.equal(1);
            matrix.linkCost(1, 0).should.equal(2);
            matrix.linkCost(0, 1).should.equal(3);
            matrix.linkCost(1, 1).should.equal(4);
            matrix.linkCost(0, 2).should.equal(5);
            matrix.linkCost(1, 2).should.equal(6);
        });
    });

});
