//DoubleArrayのノード用の定数などが定義されているクラス
igo.Node = {
    Base: {
	//BASEノードに格納するID値をエンコードするためのメソッド
	//BASEノードに格納されているID値をデコードするためにも用いられる
	ID: function(nid) {
	    return (-nid) - 1;
	}
    },
    
    //CHECKノード用の定数が定義されているクラス
    Chck: {
	//文字列の終端を表す文字コード
	//この文字はシステムにより予約されており、辞書内の形態素の表層形および解析対象テキストに含まれていた場合の動作は未定義
	TERMINATE_CODE: 0,
	
	//CHECKノードが未使用だということを示すための文字コード
	//この文字はシステムにより予約されており、辞書内の形態素の表層形および解析対象テキストに含まれていた場合の動作は未定義
	VACANT_CODE: 1,
	
	//使用可能な文字の最大値
	CODE_LIMIT: 0xFFFF
    }
};

//文字列の終端を表す文字定数
igo.Node.Chck.TERMINATE_CHAR = String.fromCharCode(igo.Node.Chck.TERMINATE_CODE);


//文字列を文字のストリームとして扱うためのクラス。
//readメソッドで個々の文字を順に読み込み、文字列の終端に達した場合には{@code Node.Chck.TERMINATE_CHAR}が返される。
//* XXX: クラス名は不適切
igo.KeyStream = function(key, start) {
    this.s = key;
    this.cur = start || 0;
    this.len = key.length;
}

igo.KeyStream.compare = function(ks1, ks2) {
    var rest1 = ks1.rest();
    var rest2 = ks2.rest();
    if(rest1<rest2) return -1;
    else if(rest1>rest2) return 1;
    else return 0;
};

igo.KeyStream.prototype = {
    startsWith: function(prefix, beg, length) {
	var cur = this.cur;
	var s = this.s;
	if(self.len - cur < length) {
	    return false;
	}
	return s.substring(cur, cur+length) == prefix.substring(beg, beg + length);
    },
    
    rest: function() {
	return this.s.substring(this.cur);
    },
    
    read: function() {
	if(this.eos()) {
	    return igo.Node.Chck.TERMINATE_CHAR;
	} else {
	    var p = this.cur;
	    this.cur += 1;
	    return this.s.charAt(p);
	}
    },
    
    eos: function() {
	return this.cur == this.len;
    },
};

//保存されているDoubleArrayを読み込んで、このクラスのインスタンスを作成する
igo.Searcher = function(buffer, bigendian) {
    var fmis = new igo.ArrayBufferStream(buffer, bigendian);
    var nodeSz = fmis.getInt();
    var tindSz = fmis.getInt();
    var tailSz = fmis.getInt();
    this.keySetSize = tindSz;
    this.begs = fmis.getIntArray(tindSz);
    this.base = fmis.getIntArray(nodeSz);
    this.lens = fmis.getShortArray(tindSz);
    this.chck = fmis.getCharArray(nodeSz);
    this.tail = fmis.getString(tailSz);
}

igo.Searcher.prototype = {
    size: function() {
	return this.keySetSize;
    },
    
    search: function(key) {
	var base = this.base;
	var chck = this.chck;
	
	var node = base.get(0);
	var kin = new KeyStream(key);
	var code = kin.read();
	while(true) {
	    var idx = node + code;
	    node = base.get(idx);
	    if(chck.get(idx) == code) {
		if(node >= 0) {
		    continue;
		} else if(kin.eos() || this.keyExists(kin, node)) {
		    return igo.Node.Base.ID(node);
		}
	    }
	    return -1;
	}
    },
    
    eachCommonPrefix: function(key, start, fn) {
	var base = this.base;
	var chck = this.chck;
	
	var node = base.get(0);
	var offset = -1;
	var kin = new igo.KeyStream(key, start);

	while(true) {
	    var code = kin.read().charCodeAt(0);
	    offset++;
	    var terminalIdx = node + igo.Node.Chck.TERMINATE_CODE;
	    if(chck.get(terminalIdx) == igo.Node.Chck.TERMINATE_CODE) {
		fn(start, offset, igo.Node.Base.ID(base.get(terminalIdx)));
		if(code == igo.Node.Chck.TERMINATE_CODE) {
		    return;
		}
	    }
	    var idx = node + code;
	    node = base.get(idx);
	    
	    if(chck.get(idx) == code) {
		if(node>=0) {
		    continue;
		} else {
		    this.call_if_keyIncluding(kin, node, start, offset, fn);
		}
	    }
	    return ;
	}
    },
    
    call_if_keyIncluding: function(kin, node, start, offset, fn) {
	var nodeId = igo.Node.Base.ID(node);
	if(kin.startsWith(this.tail, this.begs.get(nodeId), this.lens.get(nodeId))) {
	    fn(start, offset + this.lens.get(nodeId) + 1, nodeId);
	}
    },
    
    keyExists: function(kin, node) {
	var nodeId = Node.Base.ID(node);
	var beg = this.begs.get(nodeId);
	var s = this.tail.substring(beg, beg + this.lens.get(nodeId));
	return kin.rest() == s;
    }
};
