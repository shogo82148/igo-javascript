var express = require('express');
var fs = require('fs');
var igo = require('./build/igo.min');
var app = express.createServer();

function loadTagger(dicdir) {
    var dicfiles = ['char.category', 'code2category', 'word2id', 'word.dat', 'word.ary.idx', 'word.inf', 'matrix.bin'];
    var files = new Array();
    for(var i=0;i<dicfiles.length;++i) {
	files[dicfiles[i]] = fs.readFileSync(dicdir + '/' + dicfiles[i]);
    }

    var category = new igo.CharCategory(files['code2category'], files['char.category']);
    var wdc = new igo.WordDic(files['word2id'], files['word.dat'], files['word.ary.idx'], files['word.inf']);
    var unk = new igo.Unknown(category);
    var mtx = new igo.Matrix(files['matrix.bin']);
    return new igo.Tagger(wdc, unk, mtx);
}

var tagger = loadTagger('./ipadic');

app.get('/', function(req, res) {
	    var text = fs.readFileSync('./web.js', 'utf-8');
	    res.send('Hello World' + tagger.wakati('node.jsで形態素解析をしてみるテスト'));
	});
 
var port = process.env.PORT || 3000;
app.listen(port);
