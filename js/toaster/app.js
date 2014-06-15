(function() {
  var App, Graph, Node, Queue,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Node = (function() {

    function Node(name, num) {
      this.name = name;
      this.num = num != null ? num : null;
      this.adj = [];
      this.distance = 1000000;
      this.visited = false;
    }

    return Node;

  })();

  Graph = (function() {

    function Graph() {
      this.add_edge = __bind(this.add_edge, this);

      this.add_node = __bind(this.add_node, this);
      this.nodes = [new Node('fake')];
      this.size = 0;
    }

    Graph.prototype.add_node = function(name) {
      this.size += 1;
      return this.nodes.push(new Node(name, this.size));
    };

    Graph.prototype.add_edge = function(node_1, node_2, value) {
      var neighbour_1, neighbour_2;
      neighbour_1 = {
        node: node_2,
        dist: value
      };
      neighbour_2 = {
        node: node_1,
        dist: value
      };
      this.nodes[node_1].adj.push(neighbour_1);
      return this.nodes[node_2].adj.push(neighbour_2);
    };

    return Graph;

  })();

  Queue = (function() {

    function Queue(nodes) {
      var _i, _ref, _results;
      this.nodes = nodes;
      this.index_transform = __bind(this.index_transform, this);

      this.swap = __bind(this.swap, this);

      this.heapify_up = __bind(this.heapify_up, this);

      this.heapify_down = __bind(this.heapify_down, this);

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
      this.size -= 1;
      this.heapify_down(1);
      return min;
    };

    Queue.prototype.heapify = function(index) {
      this.heapify_down(index);
      return this.heapify_up(index);
    };

    Queue.prototype.heapify_down = function(index) {
      var lesser_son, _results;
      lesser_son = index * 2;
      _results = [];
      while (lesser_son <= this.size) {
        if (lesser_son < this.size && this.nodes[lesser_son + 1].distance < this.nodes[lesser_son].distance) {
          lesser_son += 1;
        }
        if (this.nodes[index] > this.nodes[lesser_son]) {
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
        _results.push(index = parent);
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

  App = (function() {

    function App() {
      this.test_graph = __bind(this.test_graph, this);
      this.graphCanvas = document.getElementById('graphCanvas').getContext('2d');
    }

    App.prototype.generate_graph = function() {
      return this.g = new Graph();
    };

    App.prototype.dijkstra = function() {
      var current, i, nbr_index, neighbour, new_distance, _i, _j, _len, _ref, _ref1, _results;
      this.q = new Queue(this.g.nodes);
      this.t = this.q.t;
      this.g.nodes[1].distance = 0;
      while (this.q.size > 0) {
        current = this.q.delete_min();
        _ref = current.adj;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          neighbour = _ref[_i];
          nbr_index = this.t[neighbour.node];
          new_distance = current.distance + neighbour.dist;
          if (new_distance < this.q.nodes[nbr_index].distance) {
            this.q.nodes[nbr_index].distance = new_distance;
            this.q.heapify(nbr_index);
          }
        }
      }
      console.log('---');
      _results = [];
      for (i = _j = 1, _ref1 = this.g.size; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
        _results.push(console.log(i, ': ', this.q.nodes[this.t[i]].distance));
      }
      return _results;
    };

    App.prototype.test_graph = function() {
      this.g = new Graph();
      this.g.add_node('A');
      this.g.add_node('B');
      this.g.add_node('C');
      this.g.add_node('D');
      this.g.add_node('E');
      this.g.add_node('F');
      this.g.add_edge(1, 2, 2);
      this.g.add_edge(1, 6, 1);
      this.g.add_edge(1, 5, 3);
      this.g.add_edge(4, 1, 5);
      this.g.add_edge(2, 6, 2);
      this.g.add_edge(2, 3, 5);
      this.g.add_edge(4, 3, 4);
      this.g.add_edge(3, 5, 4);
      this.g.add_edge(4, 5, 4);
      return this.g.add_edge(5, 6, 3);
    };

    return App;

  })();

  $(function() {
    var app;
    app = new App();
    app.test_graph();
    return app.dijkstra();
  });

}).call(this);
