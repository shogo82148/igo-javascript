#!/usr/bin/env node

var fs = require('fs');
var jsp = require("./uglify-js").parser;
var pro = require("./uglify-js").uglify;

var srclist = ["tagger.js", "dictionary.js", "trie.js", "util.js"];

var orig_code = "";
for(var i=0;i<srclist.length;++i) {
    orig_code += fs.readFileSync('../src/' + srclist[i], 'utf-8');
}

function minify(orig_code) {
    return orig_code;
    var ast = jsp.parse(orig_code); // parse code and get the initial AST
    ast = pro.ast_mangle(ast); // get a new AST with mangled names
    ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
    var final_code = pro.gen_code(ast); // compressed code here
    return final_code;
}

fs.writeFileSync('./igo.min.js', minify(orig_code));
