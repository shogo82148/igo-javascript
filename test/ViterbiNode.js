var should = require('should');
var igo = require('../build/igo.js');

describe("ViterbiNode", function() {

    it('makeBOSEOS', function() {
        var n = new igo.ViterbiNode(1, 2, 3, 4, 5, 6, true);
        n.cost.should.equal(4);
        n.nodecost.should.equal(4);
        should.not.exist(n.prev);
        n.prevs.should.eql([]);
        n.wordId.should.equal(1);
        n.start.should.equal(2);
        n.length.should.equal(3);
        n.leftId.should.equal(5);
        n.rightId.should.equal(6);
        n.isSpace.should.be.true;
    });

    it('makeBOSEOS', function() {
        var n = igo.ViterbiNode.makeBOSEOS();
        n.should.be.an.instanceOf(igo.ViterbiNode);
        n.cost.should.equal(0);
        n.nodecost.should.equal(0);
        should.not.exist(n.prev);
        n.prevs.should.eql([]);
        n.wordId.should.equal(0);
        n.start.should.equal(0);
        n.length.should.equal(0);
        n.leftId.should.equal(0);
        n.rightId.should.equal(0);
        n.isSpace.should.be.false;
    });

});
