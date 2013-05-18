var should = require('should');
var igo = require('../build/igo.js');

describe("ArrayBufferStream Test", function() {
    describe(".getInt", function() {
        var buffer = [
            0x00, 0x00, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x02,
            0x00, 0x00, 0x00, 0x03,
            0x00, 0x00, 0x00, 0x04,
            0xFF, 0xFF, 0xFF, 0xFF
        ];
        it('should parse array as little endian', function() {
            var s = new igo.ArrayBufferStream(buffer, false);
            s.getInt().should.equal(0x1000000);
            s.getInt().should.equal(0x2000000);
            s.getInt().should.equal(0x3000000);
            s.getInt().should.equal(0x4000000);
            s.getInt().should.equal(-1);
            s.pos.should.equal(buffer.length);
        });
        it('should parse array as big endian', function() {
            var s = new igo.ArrayBufferStream(buffer, true);
            s.getInt().should.equal(0x1);
            s.getInt().should.equal(0x2);
            s.getInt().should.equal(0x3);
            s.getInt().should.equal(0x4);
            s.getInt().should.equal(-1);
            s.pos.should.equal(buffer.length);
        });
    });


    describe(".getIntArray", function() {
        var buffer = [
            0x00, 0x00, 0x00, 0x01,
            0x00, 0x00, 0x00, 0x02,
            0x00, 0x00, 0x00, 0x03,
            0x00, 0x00, 0x00, 0x04,
            0xFF, 0xFF, 0xFF, 0xFF
        ];
        it('should parse array as little endian', function() {
            var s = new igo.ArrayBufferStream(buffer, false);
            var a = s.getIntArray(5);
            a.get(0).should.equal(0x1000000);
            a.get(1).should.equal(0x2000000);
            a.get(2).should.equal(0x3000000);
            a.get(3).should.equal(0x4000000);
            a.get(4).should.equal(-1);
            s.pos.should.equal(buffer.length);
        });
        it('should parse array as big endian', function() {
            var s = new igo.ArrayBufferStream(buffer, true);
            var a = s.getIntArray(5);
            a.length.should.equal(5);
            a.get(0).should.equal(0x1);
            a.get(1).should.equal(0x2);
            a.get(2).should.equal(0x3);
            a.get(3).should.equal(0x4);
            a.get(4).should.equal(-1);
            s.pos.should.equal(buffer.length);
        });
        it('should skip 4 bytes', function() {
            var s = new igo.ArrayBufferStream(buffer, true);
            s.getInt();
            var a = s.getIntArray(4);
            a.length.should.equal(4);
            a.get(0).should.equal(0x2);
            a.get(1).should.equal(0x3);
            a.get(2).should.equal(0x4);
            a.get(3).should.equal(-1);
            s.pos.should.equal(buffer.length);
        });
    });

    describe(".getShortArray", function() {
        var buffer = [
            0x00, 0x01, 0x00, 0x02,
            0x00, 0x03, 0x00, 0x04,
            0xFF, 0xFF
        ];
        it('should parse array as little endian', function() {
            var s = new igo.ArrayBufferStream(buffer, false);
            var a = s.getShortArray(5);
            a.length.should.equal(5);
            a.get(0).should.equal(0x100);
            a.get(1).should.equal(0x200);
            a.get(2).should.equal(0x300);
            a.get(3).should.equal(0x400);
            a.get(4).should.equal(-1);
            s.pos.should.equal(buffer.length);
        });
        it('should parse array as big endian', function() {
            var s = new igo.ArrayBufferStream(buffer, true);
            var a = s.getShortArray(5);
            a.length.should.equal(5);
            a.get(0).should.equal(0x1);
            a.get(1).should.equal(0x2);
            a.get(2).should.equal(0x3);
            a.get(3).should.equal(0x4);
            a.get(4).should.equal(-1);
            s.pos.should.equal(buffer.length);
        });
        it('should skip 4 bytes', function() {
            var s = new igo.ArrayBufferStream(buffer, true);
            s.getInt();
            var a = s.getShortArray(3);
            a.length.should.equal(3);
            a.get(0).should.equal(0x3);
            a.get(1).should.equal(0x4);
            a.get(2).should.equal(-1);
            s.pos.should.equal(buffer.length);
        });
    });


    describe(".getCharArray", function() {
        var buffer = [
            0x00, 0x01, 0x00, 0x02,
            0x00, 0x03, 0x00, 0x04,
            0xFF, 0xFF
        ];
        it('should parse array as little endian', function() {
            var s = new igo.ArrayBufferStream(buffer, false);
            var a = s.getCharArray(5);
            a.length.should.equal(5);
            a.get(0).should.equal(0x100);
            a.get(1).should.equal(0x200);
            a.get(2).should.equal(0x300);
            a.get(3).should.equal(0x400);
            a.get(4).should.equal(0xFFFF);
            s.pos.should.equal(buffer.length);
        });
        it('should parse array as big endian', function() {
            var s = new igo.ArrayBufferStream(buffer, true);
            var a = s.getCharArray(5);
            a.length.should.equal(5);
            a.get(0).should.equal(0x1);
            a.get(1).should.equal(0x2);
            a.get(2).should.equal(0x3);
            a.get(3).should.equal(0x4);
            a.get(4).should.equal(0xFFFF);
            s.pos.should.equal(buffer.length);
        });
        it('should skip 4 bytes', function() {
            var s = new igo.ArrayBufferStream(buffer, true);
            s.getInt();
            var a = s.getCharArray(3);
            a.length.should.equal(3);
            a.get(0).should.equal(0x3);
            a.get(1).should.equal(0x4);
            a.get(2).should.equal(0xFFFF);
            s.pos.should.equal(buffer.length);
        });
    });


    describe(".getString", function() {
        it('should parse array as little endian', function() {
            var buffer = [
                0x30, 0x00, 0x41, 0x00,
                0x42, 0x30, 0xF2, 0x98
            ];
            var s = new igo.ArrayBufferStream(buffer, false);
            s.getString(4).should.equal('0Aあ飲');
            s.pos.should.equal(buffer.length);
        });
        it('should parse array as big endian', function() {
            var buffer = [
                0x00, 0x30, 0x00, 0x41,
                0x30, 0x42, 0x98, 0xF2
            ];
            var s = new igo.ArrayBufferStream(buffer, true);
            s.getString(4).should.equal('0Aあ飲');
            s.pos.should.equal(buffer.length);
        });
        it('should skip 4 bytes', function() {
            var buffer = [
                0x00, 0x30, 0x00, 0x41,
                0x30, 0x42, 0x98, 0xF2
            ];
            var s = new igo.ArrayBufferStream(buffer, true);
            s.getInt();
            s.getString(2).should.equal('あ飲');
            s.pos.should.equal(buffer.length);
        });
    });

    describe(".size", function() {
        var buffer = [
            0x00, 0x00, 0x00, 0x00
        ];
        it('should return array size', function() {
            var s = new igo.ArrayBufferStream(buffer, false);
            s.size().should.equal(4);
        });
    });

});
