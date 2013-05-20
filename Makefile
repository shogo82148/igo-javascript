LIB = lib/jsheap/jsheap.js
SRC = src/tagger.js src/dictionary.js src/trie.js src/util.js;
REPORTER = spec

all: build/igo.js

build/igo.js: $(LIB) $(SRC)
	cd build; ./build.js

test: build/igo.js
	./node_modules/.bin/mocha --reporter $(REPORTER)

.PHONY: all test
