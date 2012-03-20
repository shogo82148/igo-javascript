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

app.use(express.bodyParser());
app.use(express.static(__dirname, { maxAge: 356*24*60*60*1000 }));

function igo_parse(req, res) {
    var method = req.param('method');
    var text = req.param('text');
    var best = req.param('best');
    var ret = 'var useNodeJS = true;';

    if(method=='parse') {
	ret = {
	    method: method,
	    event: "result",
	    text: text,
	    morpheme: tagger.parse(text)
	};
    } else if(method=='wakati') {
	ret = {
	    method: method,
	    event: "result",
	    text: text,
	    morpheme: tagger.wakati(text)
	};
    } else if(method=='parseNBest') {
	ret = {
	    method: method,
	    event: "result",
	    text: text,
	    morpheme: tagger.parseNBest(text, best)
	};
    }
    res.send(ret);
}

app.get('/igo', igo_parse);
app.post('/igo', igo_parse);

var port = process.env.PORT || 3000;
app.listen(port);
