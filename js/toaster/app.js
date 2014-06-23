(function() {
  var App,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  App = (function() {

    App.prototype.initialize_views = function(graph_canvas, queue_canvas) {
      this.graph_view = new GraphView('graphCanvas');
      this.queue_view = new QueueView('queueCanvas');
      this.states_list = new StatesList('statesList', this.graph_view, this.queue_view);
      return this.exec = false;
    };

    function App() {
      this.reset = __bind(this.reset, this);

      this.process_nodes = __bind(this.process_nodes, this);

      this.dijkstra = __bind(this.dijkstra, this);

      this.generate_graph = __bind(this.generate_graph, this);

      this.initialize_views = __bind(this.initialize_views, this);

      var _this = this;
      this.initialize_views();
      this.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
      this.gen_btn = $('#generateGraph');
      this.gen_btn.click(function() {
        _this.reset();
        _this.generate_graph();
        return _this.gen_btn.prop('disabled', true);
      });
    }

    App.prototype.generate_graph = function() {
      var edge_values, edges, i, j, joining_order, k, m, n, _i, _j, _k, _l, _len, _len1, _ref;
      this.g = new Graph();
      n = Rand.random({
        min: 5,
        max: 12
      });
      m = Rand.random({
        min: n - 1,
        max: 2 * n
      });
      edges = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; 0 <= n ? _i <= n : _i >= n; i = 0 <= n ? ++_i : --_i) {
          _results.push([]);
        }
        return _results;
      })();
      edge_values = [];
      joining_order = Rand.unique_random({
        quantity: n - 1,
        min: 2,
        max: n
      });
      for (_i = 0, _len = joining_order.length; _i < _len; _i++) {
        i = joining_order[_i];
        j = Rand.random({
          min: 1,
          max: i - 1
        });
        edges[j].push(i);
        edge_values.push(Rand.random({
          min: 1,
          max: 6
        }));
      }
      m = m - (n - 1);
      while (m > 0) {
        i = Rand.random({
          min: 1,
          max: n
        });
        j = Rand.random({
          min: 1,
          max: n
        });
        if (i === j || __indexOf.call(edges[i], j) >= 0 || __indexOf.call(edges[j], i) >= 0) {
          continue;
        }
        edges[i].push(j);
        edge_values.push(Rand.random({
          min: 1,
          max: 9
        }));
        m--;
      }
      for (i = _j = 1; 1 <= n ? _j <= n : _j >= n; i = 1 <= n ? ++_j : --_j) {
        this.g.add_node(this.letters[i - 1]);
      }
      k = 0;
      for (i = _k = 1; 1 <= n ? _k <= n : _k >= n; i = 1 <= n ? ++_k : --_k) {
        _ref = edges[i];
        for (_l = 0, _len1 = _ref.length; _l < _len1; _l++) {
          j = _ref[_l];
          this.g.add_edge(i, j, edge_values[k++]);
        }
      }
      this.graph_view.generate(this.g);
      this.queue_view.generate(this.g);
      return this.dijkstra();
    };

    App.prototype.dijkstra = function() {
      this.q = new Queue(this.g.nodes);
      this.t = this.q.t;
      this.g.nodes[1].distance = 0;
      this.graph_view.update(this.g.nodes[1], 'initial');
      this.queue_view.update('initial');
      this.states_list.update();
      return this.process_nodes();
    };

    App.prototype.process_nodes = function(node, i) {
      var current, nbr_index, neighbour, new_distance,
        _this = this;
      if (node == null) {
        node = null;
      }
      if (i == null) {
        i = 0;
      }
      if (!node && this.q.size === 0) {
        this.gen_btn.prop('disabled', false);
        return;
      }
      if (!node && this.q.size > 0) {
        return setTimeout((function() {
          var current;
          current = _this.q.delete_min();
          _this.graph_view.update(current, 'visited');
          _this.queue_view.update('deleted');
          _this.states_list.update();
          return _this.process_nodes(current);
        }), 450);
      } else if (node) {
        if (i >= node.adj.length) {
          this.process_nodes();
          return;
        }
        neighbour = node.adj[i];
        nbr_index = this.t[neighbour.node];
        current = this.g.nodes[nbr_index];
        new_distance = node.distance + neighbour.dist;
        if (new_distance >= current.distance) {
          return this.process_nodes(node, i + 1);
        } else {
          return setTimeout((function() {
            current.distance = new_distance;
            _this.q.heapify_up(nbr_index);
            _this.graph_view.update(current, 'updated');
            _this.queue_view.update();
            _this.states_list.update();
            return _this.process_nodes(node, i + 1);
          }), 450);
        }
      }
    };

    App.prototype.reset = function() {
      this.graph_canvas = this.graph_view.canvas.clearRect(0, 0, 570, 630);
      this.queue_canvas = this.queue_view.canvas.clearRect(0, 0, 480, 480);
      this.states_list.list.empty();
      return this.initialize_views();
    };

    return App;

  })();

  $(function() {
    var app;
    return app = new App();
  });

}).call(this);
