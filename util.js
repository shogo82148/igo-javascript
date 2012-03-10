//urlからArrayBufferを読み取って返す
igo.getServerFileToArrayBufffer = function (url, successCallback) {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {
		if (xhr.readyState == xhr.DONE) {
			if ((xhr.status==200 || xhr.status==304) && xhr.response) {
				// 'response' プロパティが ArrayBuffer を返す
				successCallback(xhr.response);
			} else {
				alert("Failed to download:" + xhr.status + " " + xhr.statusText);
			}
		}
	}
	
	// 指定された URL へのリクエストを作成
	xhr.open("GET", url, true);
	
	// ArrayBuffer オブジェクトでの応答を得るため、responseType を 'arraybuffer' に設定
	xhr.responseType = "arraybuffer";
	xhr.send();
	
	return xhr;
}

//4バイト整数型の配列を表すクラス
igo.IntArray = function (buffer, pos, elementCount, bigendian) {
	this.buffer = buffer;
	this.pos = pos;
	this.elementCount = elementCount;
	this.bigendian = bigendian;
}

igo.IntArray.readUInt = function(buffer, pos, bigendian) {
	var result = 0;
	if(bigendian) {
		result = (buffer[pos] << 24) |
				(buffer[pos+1] << 16) |
				(buffer[pos+2] << 8) |
				(buffer[pos+3]);
	} else {
		result = (buffer[pos+3] << 24) |
				(buffer[pos+2] << 16) |
				(buffer[pos+1] << 8) |
				(buffer[pos]);
	}
	return result;
};

igo.IntArray.readInt = function(buffer, pos, bigendian) {
	var result = igo.IntArray.readUInt(buffer, pos, bigendian);
	if(result>=0x80000000) {
		result -= 0x100000000;
	}
	return result;
};

igo.IntArray.prototype = {
	get: function(offset) {
		var pos = this.pos + offset * 4;
		return igo.IntArray.readInt(this.buffer, pos, this.bigendian);
	},
};

//2バイト整数型の配列を表すクラス
igo.ShortArray = function (buffer, pos, elementCount, bigendian) {
	this.buffer = buffer;
	this.pos = pos;
	this.elementCount = elementCount;
	this.bigendian = bigendian;
}

igo.ShortArray.readUShort = function(buffer, pos, bigendian) {
	var result = 0;
	if(bigendian) {
		result = (buffer[pos] << 8) |
				(buffer[pos+1]);
	} else {
		result = (buffer[pos+1] << 8) |
				(buffer[pos]);
	}
	return result;
};

igo.ShortArray.readShort = function(buffer, pos, bigendian) {
	var result = igo.ShortArray.readUShort(buffer, pos, bigendian);
	if(result>=0x8000) {
		result -= 0x10000;
	}
	return result;
};

igo.ShortArray.prototype = {
	get: function(offset) {
		var pos = this.pos + offset * 2;
		return igo.ShortArray.readShort(this.buffer, pos, this.bigendian);
	},
};

//UTF-16の文字列を表すクラス
igo.CharArray = function(buffer, pos, elementCount, bigendian) {
	this.buffer = buffer;
	this.pos = pos;
	this.elementCount = elementCount;
	this.bigendian = bigendian;
}

igo.CharArray.prototype = {
	get: function(offset) {
		var pos = this.pos + offset * 2;
		return igo.ShortArray.readUShort(this.buffer, pos, this.bigendian);
	},
};

//ArrayBufferを読み取るストリーム
igo.ArrayBufferStream = function(buffer, bigendian) {
	this.buffer = new Uint8Array(buffer);
	this.bigendian = bigendian;
	this.pos = 0;
}

igo.ArrayBufferStream.prototype = {
	getInt: function () {
		var result = igo.IntArray.readInt(this.buffer, this.pos, this.bigendian);
		this.pos += 4;
		return result;
	},
	
	getIntArray: function(elementCount) {
		var array = new igo.IntArray(this.buffer, this.pos, elementCount, this.bigendian);
		this.pos += elementCount*4;
		return array;
	},
	
	getShortArray: function(elementCount) {
		var array = new igo.ShortArray(this.buffer, this.pos, elementCount, this.bigendian);
		this.pos += elementCount*2;
		return array;
	},
	
	getCharArray: function(elementCount) {
		var array = new igo.CharArray(this.buffer, this.pos, elementCount, this.bigendian);
		this.pos += elementCount*2;
		return array;
	},
	
	getString: function(elementCount) {
		var array = new igo.CharArray(this.buffer, this.pos, elementCount, this.bigendian);
		var s = '';
		for(var i=0; i<elementCount; i++) {
			s += String.fromCharCode(array[i]);
		}
		this.pos += elementCount*2;
		return s;
	},
	
	size: function() {
		return this.buffer.length;
	},
};

igo.getIntArray = function(buffer, bigendian) {
	return (new igo.ArrayBufferStream(buffer, bigendian)).getIntArray();
}

igo.getCharArray = function(buffer, bigendian) {
	return (new igo.ArrayBufferStream(buffer, bigendian)).getCharArray();
}
