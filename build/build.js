#!/usr/bin/env node

var fs = require('fs');
var jsp = require("./uglify-js").parser;
var pro = require("./uglify-js").uglify;

var srclist = ["tagger.js", "dictionary.js", "trie.js", "util.js"];

var orig_code = "var igo = {};";
for(var i=0;i<srclist.length;++i) {
    orig_code += fs.readFileSync('../src/' + srclist[i], 'utf-8');
}

var ast = jsp.parse(orig_code); // parse code and get the initial AST
ast = pro.ast_mangle(ast); // get a new AST with mangled names
ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
var final_code = pro.gen_code(ast); // compressed code here

fs.writeFileSync('./igo.min.js', final_code);
