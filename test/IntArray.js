var should = require('should');
var igo = require('../build/igo.js');

describe("IntArray Test", function() {
    describe(".readUInt", function() {
        it('should parse array as little endian', function() {
            igo.IntArray.readUInt(
                [0x12, 0x34, 0x56, 0x78],
                0,
                false).should.equal(0x78563412);
        });
        it('should parse array as big endian', function() {
            igo.IntArray.readUInt(
                [0x12, 0x34, 0x56, 0x78],
                0,
                true).should.equal(0x12345678);
        });
        it('should parse as a positive number', function() {
            igo.IntArray.readUInt(
                [0xFF, 0xFF, 0xFF, 0xFF],
                0,
                true).should.equal(0xFFFFFFFF);
        });
        it('should skip 4 bytes', function() {
            igo.IntArray.readUInt(
                [
                    0x11, 0x22, 0x33, 0x44,
                    0x55, 0x66, 0x77, 0x88
                ],
                4,
                true).should.equal(0x55667788);
        });
    });

    describe(".readInt", function() {
        it('should parse array as little endian', function() {
            igo.IntArray.readInt(
                [0x12, 0x34, 0x56, 0x78],
                0,
                false).should.equal(0x78563412);
        });
        it('should parse array as big endian', function() {
            igo.IntArray.readInt(
                [0x12, 0x34, 0x56, 0x78],
                0,
                true).should.equal(0x12345678);
        });
        it('should parse as a negative number', function() {
            igo.IntArray.readInt(
                [0xFF, 0xFF, 0xFF, 0xFF],
                0,
                true).should.equal(-1);
        });
        it('should skip 4 bytes', function() {
            igo.IntArray.readUInt(
                [
                    0x11, 0x22, 0x33, 0x44,
                    0x55, 0x66, 0x77, 0x88
                ],
                4,
                true).should.equal(0x55667788);
        });
    });

    describe(".get", function() {
        var buffer = [
            0x00, 0x00, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x02,
            0x00, 0x00, 0x00, 0x03,
            0x00, 0x00, 0x00, 0x04,
            0xFF, 0xFF, 0xFF, 0xFF
        ];
        it('should parse array as little endian', function() {
            var a = new igo.IntArray(buffer, 0, buffer.length / 4, false);
            a.get(0).should.equal(0x1000000);
            a.get(1).should.equal(0x2000000);
            a.get(2).should.equal(0x3000000);
            a.get(3).should.equal(0x4000000);
            a.get(4).should.equal(-1);
        });
        it('should parse array as big endian', function() {
            var a = new igo.IntArray(buffer, 0, buffer.length / 4, true);
            a.get(0).should.equal(0x1);
            a.get(1).should.equal(0x2);
            a.get(2).should.equal(0x3);
            a.get(3).should.equal(0x4);
            a.get(4).should.equal(-1);
        });
        it('should skip 4 bytes', function() {
            var a = new igo.IntArray(buffer, 4, buffer.length / 4, true);
            a.get(0).should.equal(0x2);
            a.get(1).should.equal(0x3);
            a.get(2).should.equal(0x4);
            a.get(3).should.equal(-1);
        });
    });

});