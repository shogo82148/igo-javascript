
//Viterbiアルゴリズムで使用されるノード
igo.ViterbiNode = function(wordId, start, length, cost, leftId, rightId, isSpace) {
	this.cost = cost; //始点からノードまでの総コスト
	this.prev = undefined; //コスト最小の前方のノードへのリンク
	this.wordId = wordId; //単語ID
	this.start = start; //入力テキスト内での形態素の開始位置
	this.length = length; //形態素の表層形の長さ(文字数)
	this.leftId = leftId; //左文脈ID
	this.rightId = rightId; //右文脈ID
	this.isSpace = isSpace; //形態素の文字種(文字カテゴリ)が空白文字かどうか
};

igo.ViterbiNode.makeBOSEOS = function() {
	return new igo.ViterbiNode(0, 0, 0, 0, 0, 0, false);
};

//形態素の連接コスト表を扱うクラス
igo.Matrix = function(buffer, bigendian) {
	fmis = new igo.ArrayBufferStream(buffer, bigendian);
	this.leftSize = fmis.getInt();
	this.rightSize = fmis.getInt();
	this.matrix = fmis.getShortArray(this.leftSize * this.rightSize);
};

//形態素同士の連接コストを求める
igo.Matrix.prototype.linkCost = function(leftId, rightId) {
	return this.matrix.get(rightId * this.leftSize + leftId);
};

igo.WordDic = function(word2id, worddat, wordary, wordinf, bigendian) {
	this.trie = new igo.Searcher(word2id, bigendian);
	this.data = igo.getCharArray(worddat, bigendian);
	this.indices = igo.getIntArray(wordary, bigendian);
	
	var fmis = new igo.ArrayBufferStream(wordinf, bigendian);
	var wordCount = fmis.size() / (4 + 2 + 2 + 2);
	
	//dataOffsets[単語ID] = 単語の素性データの開始位置
	this.dataOffsets = fmis.getIntArray(wordCount);
	
	//leftIds[単語ID] = 単語の左文脈ID
	this.leftIds = fmis.getShortArray(wordCount);
	
	//rightIds[単語ID] = 単語の右文脈ID
	this.rightIds = fmis.getShortArray(wordCount);
	
	//consts[単語ID] = 単語のコスト
	this.costs = fmis.getCharArray(wordCount);
};

igo.WordDic.prototype = {
	search: function(text, start, callback) {
		var costs = this.costs;
		var leftIds = this.leftIds;
		var rightIds = this.rightIds;
		var indices = this.indices;
		
		function fn(start, offset, trieId) {
			var end = indices.get(trieId + 1);
			for(var i=indices.get(trieId); i<end; i++) {
				callback(new igo.ViterbiNode(i, start, offset, costs.get(i),
						leftIds.get(i), rightIds.get(i), false));
			}
		}
		this.trie.eachCommonPrefix(text, start, fn);
	},
	wordData: function(wordId) {
		var res = Array();
		var start = this.dataOffsets.get(wordId);
		var end = this.dataOffsets.get(wordId+1);
		for(var i=start;i<end;i++) {
			res.push(String.fromCharCode(this.data.get(i)));
		}
		return res;
	},
};
