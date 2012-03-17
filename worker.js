igo = {};
importScripts("util.js", "trie.js", "dictionary.js", "tagger.js", "zip.min.js", "jsheap.js");

var tagger;

addEventListener("message", function (event) {
	if(event.data.dic) {
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
	}
	
	if(event.data.text) {
		postMessage({event: "result", morpheme: tagger.parse(event.data.text)});
	}
});
