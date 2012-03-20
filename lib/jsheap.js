(function(global) {
	global.jsheap = function(cmp) {
		//Compare function
		this.cmp = cmp || function(a, b) {
			return a<b;
		};
		
		// heap[0] is dummpy
		this.heap = [null];
	};
	
	function swap(heap, a, b) {
		var tmp = heap[a];
		heap[a] = heap[b];
		heap[b] = tmp;
	}
	
	global.jsheap.prototype.push = function(item) {
		var heap = this.heap;
		var cmp = this.cmp;
		var i = heap.length;
		
		heap.push(item);
		while(i>1 && cmp(heap[i], heap[Math.floor(i/2)])) {
			var j = Math.floor(i/2);
			swap(heap, i, j);
			i = j;
		}
		return this;
	};
	
	global.jsheap.prototype.top = function() {
		return this.heap[1];
	};
	
	global.jsheap.prototype.pop = function() {
		var heap = this.heap;
		var cmp = this.cmp;
		var i;
		var item = heap.pop();
		if(this.empty()) return this;
		i = 1;
		heap[1] = item;
		
		while(i*2 < heap.length) {
			var j = i*2;
			if(j+1 < heap.length && cmp(heap[j+1], heap[j])) {
				++j;
			}
			if(!cmp(heap[j], heap[i])) {
				break;
			}
			swap(heap, i, j);
			i = j;
		}
		
		return this;
	};
	
	global.jsheap.prototype.empty = function() {
		return this.heap.length <= 1;
	};
})(this);