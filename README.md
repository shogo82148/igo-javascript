igo-javascript: Morphological analyzer for Javascript
======

[![Build Status](https://api.travis-ci.org/shogo82148/igo-javascript.png)](https://api.travis-ci.org/shogo82148/igo-javascript)

## これは何？
Javaで書かれた形態素解析器[Igo](http://igo.sourceforge.jp/)のJavascript移植版です。
ブラウザ上で、Node.jsで、日本語の形態素解析を行うことができます。

## とりあえず試してみる

[GitHub Pages](http://shogo82148.github.io/igo-javascript/)で試すことができます。

## インストール
ブラウザ上で実行する場合は、
レポジトリの`./build/igo.js`か`./build/igo.min.js`を
ダウンロード可能なところにおいてください。

Node.jsで実行する場合は、
npmとかには登録してないので、レポジトリの`./build/igo.js`か`./build/igo.min.js`を
パスの通った場所に置きましょう。

## 使い方

### 辞書を作る
igo-javascriptを動作させるにはバイナリ辞書が必要ですが、
igo-javascript自身にはバイナリ辞書を作る機能はありません。
Java版の[Igo](http://igo.sourceforge.jp/)で作成したバイナリ辞書をそのまま使用します。
作成方法は[Igo](http://igo.sourceforge.jp/)のページを参照してください。

### 解析する

ファイルIOの部分をクライアントサイドとサーバサイドで統一するのが難しかったので、
igo-javascript自身にはファイルの読み込み機能はなく、すべてメモリ上で動作します。
ちょっと面倒ですが、辞書に関連するファイルの読み込みをすべて自前でやる必要があります。
以下はNode.jsで実行する例です。

``` javascript
var fs = require('fs');
var igo = require('./build/igo.min.js');

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

// 分かち書きだけする
console.log(tagger.wakati('node.jsで形態素解析をしてみるテスト'));

// 品詞情報も一緒に取得する
console.log(tagger.parse('node.jsで形態素解析をしてみるテスト'));

// NBest解を取得する(igo-javascript独自拡張)
console.log(tagger.parseNBest('node.jsで形態素解析をしてみるテスト', 5));
```
