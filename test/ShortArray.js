var should = require('should');
var igo = require('../build/igo.js');

describe("ShortArray Test", function() {
    describe(".readUShort", function() {
        it('should parse array as little endian', function() {
            igo.ShortArray.readUShort(
                [0x12, 0x34],
                0,
                false).should.equal(0x3412);
        });
        it('should parse array as big endian', function() {
            igo.ShortArray.readUShort(
                [0x12, 0x34],
                0,
                true).should.equal(0x1234);
        });
        it('should parse as a positive number', function() {
            igo.ShortArray.readUShort(
                [0xFF, 0xFF],
                0,
                true).should.equal(0xFFFF);
        });
        it('should skip 4 bytes', function() {
            igo.ShortArray.readUShort(
                [
                    0x11, 0x22, 0x33, 0x44,
                    0x55, 0x66, 0x77, 0x88
                ],
                4,
                true).should.equal(0x5566);
        });
    });

    describe(".readShort", function() {
        it('should parse array as little endian', function() {
            igo.ShortArray.readShort(
                [0x12, 0x34],
                0,
                false).should.equal(0x3412);
        });
        it('should parse array as big endian', function() {
            igo.ShortArray.readShort(
                [0x12, 0x34],
                0,
                true).should.equal(0x1234);
        });
        it('should parse as a negative number', function() {
            igo.ShortArray.readShort(
                [0xFF, 0xFF],
                0,
                true).should.equal(-1);
        });
        it('should skip 4 bytes', function() {
            igo.ShortArray.readShort(
                [
                    0x11, 0x22, 0x33, 0x44,
                    0x55, 0x66, 0x77, 0x88
                ],
                4,
                true).should.equal(0x5566);
        });
    });

    describe(".get", function() {
        var buffer = [
            0x00, 0x01, 0x00, 0x02,
            0x00, 0x03, 0x00, 0x04,
            0xFF, 0xFF
        ];
        it('should parse array as little endian', function() {
            var a = new igo.ShortArray(buffer, 0, buffer.length / 2, false);
            a.get(0).should.equal(0x100);
            a.get(1).should.equal(0x200);
            a.get(2).should.equal(0x300);
            a.get(3).should.equal(0x400);
            a.get(4).should.equal(-1);
        });
        it('should parse array as big endian', function() {
            var a = new igo.ShortArray(buffer, 0, buffer.length / 2, true);
            a.get(0).should.equal(0x1);
            a.get(1).should.equal(0x2);
            a.get(2).should.equal(0x3);
            a.get(3).should.equal(0x4);
            a.get(4).should.equal(-1);
        });
        it('should skip 2 bytes', function() {
            var a = new igo.ShortArray(buffer, 2, buffer.length / 2, true);
            a.get(0).should.equal(0x2);
            a.get(1).should.equal(0x3);
            a.get(2).should.equal(0x4);
            a.get(3).should.equal(-1);
        });
    });

});