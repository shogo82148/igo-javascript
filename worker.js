igo = {};
importScripts("util.js", "trie.js", "dictionary.js", "tagger.js", "zip.min.js", "jsheap.js");

var tagger;

addEventListener("message", function (event) {
	var method = event.data.method;
	if(method=='setdic') {
		var reader = new FileReaderSync();
		zip = Zip.inflate(
			new Uint8Array(reader.readAsArrayBuffer(event.data.dic))
		);
		
		var charcategory = zip.files['char.category'].inflate();
		var code2category = zip.files['code2category'].inflate();
		var word2id = zip.files['word2id'].inflate();
		var worddat = zip.files['word.dat'].inflate();
		var wordary = zip.files['word.ary.idx'].inflate();
		var wordinf = zip.files['word.inf'].inflate();
		var matrix = zip.files['matrix.bin'].inflate();
		
		var category = new igo.CharCategory(code2category, charcategory);
		var wdc = new igo.WordDic(word2id, worddat, wordary, wordinf);
		var unk = new igo.Unknown(category);
		var mtx = new igo.Matrix(matrix);
		tagger = new igo.Tagger(wdc, unk, mtx);
		
		postMessage({event: "load"});
	} else if(method=='parse') {
		postMessage({
			method: method,
			event: "result",
			text: event.data.text,
			morpheme: tagger.parse(event.data.text),
		});
	} else if(method=='wakati') {
		postMessage({
			method: method,
			event: "result",
			text: event.data.text,
			morpheme: tagger.wakati(event.data.text),
		});
	} else if(method=='parseNBest') {
		postMessage({
			method: method,
			event: "result",
			text: event.data.text,
			morpheme: tagger.parseNBest(event.data.text, event.data.best),
		});
	}
});
