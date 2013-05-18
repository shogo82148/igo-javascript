LIB = lib/jsheap.js
SRC = src/tagger.js src/dictionary.js src/trie.js src/util.js;

all: build/igo.js

build/igo.js: $(LIB) $(SRC)
	cd build; ./build.js

test: build/igo.js
	mocha --reporter spec

.PHONY: all test
