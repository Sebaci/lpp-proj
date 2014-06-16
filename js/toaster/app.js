(function() {
  var App, QueueView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  QueueView = (function() {

    function QueueView(canvas) {
      this.generate = __bind(this.generate, this);
      this.canvas = document.getElementById(canvas).getContext('2d');
      this.queue_states = [];
      this.colors = {
        red: '#ff5d40',
        blue: '#4188D2'
      };
    }

    QueueView.prototype.generate = function(graph) {
      var coord;
      this.nodes = graph.nodes;
      this.size = this.nodes.length - 1;
      this.generate_coords();
      return console.log((function() {
        var _i, _len, _ref, _results;
        _ref = this.coords;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          coord = _ref[_i];
          _results.push(coord.x);
        }
        return _results;
      }).call(this));
    };

    QueueView.prototype.generate_coords = function() {
      this.coords = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      return this.gen_coord(1, Math.ceil(this.coords.length / 2), 1);
    };

    QueueView.prototype.gen_coord = function(n, position, level) {
      if (n >= this.coords.length) {
        return;
      }
      this.coords[n] = {
        x: position,
        y: level
      };
      this.gen_coord(n * 2, position - Math.floor(this.coords.length / Math.pow(2, level + 1)), level + 1);
      return this.gen_coord(n * 2 + 1, position + Math.floor(this.coords.length / Math.pow(2, level + 1)), level + 1);
    };

    return QueueView;

  })();

  App = (function() {

    function App() {
      this.test_graph = __bind(this.test_graph, this);

      this.process_nodes = __bind(this.process_nodes, this);

      this.dijkstra = __bind(this.dijkstra, this);

      this.generate_graph = __bind(this.generate_graph, this);
      this.graph_view = new GraphView('graphCanvas');
      this.queue_view = new QueueView('queueCanvas');
      this.states_list = new StatesList('statesList', this.graph_view);
    }

    App.prototype.generate_graph = function() {
      this.g = new Graph();
      this.test_graph();
      this.graph_view.generate(this.g);
      return this.queue_view.generate(this.g);
    };

    App.prototype.dijkstra = function() {
      this.q = new Queue(this.g.nodes);
      this.t = this.q.t;
      this.g.nodes[1].distance = 0;
      this.graph_view.update(this.g.nodes, 'initial');
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
      if (!node && this.q.size > 0) {
        return setTimeout((function() {
          var current;
          current = _this.q.delete_min();
          _this.graph_view.update(current, 'visited');
          _this.states_list.update();
          return _this.process_nodes(current);
        }), 700);
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
            _this.q.heapify(nbr_index);
            _this.graph_view.update(current, 'updated');
            _this.states_list.update();
            return _this.process_nodes(node, i + 1);
          }), 700);
        }
      }
    };

    App.prototype.test_graph = function() {
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
    app.generate_graph();
    return app.dijkstra();
  });

}).call(this);
