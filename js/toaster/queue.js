(function() {
  var Queue,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Queue = (function() {

    function Queue(nodes) {
      var _i, _ref, _results;
      this.nodes = nodes;
      this.index_transform = __bind(this.index_transform, this);

      this.swap = __bind(this.swap, this);

      this.heapify_up = __bind(this.heapify_up, this);

      this.heapify = __bind(this.heapify, this);

      this.delete_min = __bind(this.delete_min, this);

      this.size = this.nodes.length - 1;
      this.t = (function() {
        _results = [];
        for (var _i = 0, _ref = this.size; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this);
    }

    Queue.prototype.delete_min = function() {
      var min;
      min = this.nodes[1];
      min.visited = true;
      this.swap(1, this.size);
      this.size--;
      this.heapify(1);
      return min;
    };

    Queue.prototype.heapify = function(index) {
      var lesser_son, _results;
      lesser_son = index * 2;
      _results = [];
      while (lesser_son <= this.size) {
        if (lesser_son < this.size && this.nodes[lesser_son + 1].distance < this.nodes[lesser_son].distance) {
          lesser_son++;
        }
        if (this.nodes[index].distance > this.nodes[lesser_son].distance) {
          this.swap(index, lesser_son);
          index = lesser_son;
          _results.push(lesser_son *= 2);
        } else {
          break;
        }
      }
      return _results;
    };

    Queue.prototype.heapify_up = function(index) {
      var parent, _results;
      parent = Math.floor(index / 2);
      _results = [];
      while (parent >= 1 && this.nodes[parent].distance > this.nodes[index].distance) {
        this.swap(index, parent);
        index = parent;
        _results.push(parent = Math.floor(index / 2));
      }
      return _results;
    };

    Queue.prototype.swap = function(i, j) {
      var tmp;
      this.index_transform(i, j);
      tmp = this.nodes[j];
      this.nodes[j] = this.nodes[i];
      return this.nodes[i] = tmp;
    };

    Queue.prototype.index_transform = function(i, j) {
      this.t[this.nodes[i].num] = j;
      return this.t[this.nodes[j].num] = i;
    };

    return Queue;

  })();

  window.Queue = Queue;

}).call(this);
