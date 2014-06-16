(function() {
  var App, GraphView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  GraphView = (function() {

    function GraphView(canvas) {
      this.update = __bind(this.update, this);

      this.draw_node = __bind(this.draw_node, this);

      this.draw_all_nodes = __bind(this.draw_all_nodes, this);

      this.draw_edges = __bind(this.draw_edges, this);

      this.draw_graph = __bind(this.draw_graph, this);

      this.generate_coords = __bind(this.generate_coords, this);

      this.generate = __bind(this.generate, this);
      this.canvas = document.getElementById(canvas).getContext('2d');
      this.graph_states = [];
      this.colors = {
        green: '#7aee3c',
        red: '#ff5d40',
        blue: '#4188D2',
        orange: '#ffc040'
      };
    }

    GraphView.prototype.generate = function(graph) {
      var i, initial_state, node;
      this.nodes = graph.nodes;
      this.size = this.nodes.length - 1;
      this.generate_coords();
      initial_state = {
        colors: (function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 0, _ref = this.size; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            _results.push(this.colors.red);
          }
          return _results;
        }).call(this),
        distances: (function() {
          var _i, _len, _ref, _results;
          _ref = this.nodes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.distance);
          }
          return _results;
        }).call(this),
        info: 'Stan początkowy'
      };
      $('#test').html(initial_state.info);
      this.graph_states.push(initial_state);
      this.current_state = 0;
      return this.draw_graph();
    };

    GraphView.prototype.generate_coords = function() {
      var coord, i, pos, spacing, x_pos, x_random, y_pos, y_random, _i, _ref, _results;
      x_random = Rand.unique_random({
        quantity: this.size,
        min: 1,
        max: 15
      });
      y_random = Rand.unique_random({
        quantity: this.size,
        min: 1,
        max: 15
      });
      spacing = 30;
      x_pos = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = x_random.length; _i < _len; _i++) {
          pos = x_random[_i];
          _results.push(pos * spacing);
        }
        return _results;
      })();
      y_pos = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = y_random.length; _i < _len; _i++) {
          pos = y_random[_i];
          _results.push(pos * spacing);
        }
        return _results;
      })();
      this.coords = [
        {
          x: null,
          y: null
        }
      ];
      _results = [];
      for (i = _i = 0, _ref = this.size - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        coord = {
          x: x_pos[i],
          y: y_pos[i]
        };
        _results.push(this.coords.push(coord));
      }
      return _results;
    };

    GraphView.prototype.draw_graph = function() {
      this.draw_edges();
      return this.draw_all_nodes();
    };

    GraphView.prototype.draw_edges = function() {
      var coords_begin, coords_end, e, edge_value, edge_values, neighbour, node, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _results;
      edge_values = [];
      _ref = this.nodes.slice(1);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        coords_begin = this.coords[node.num];
        _ref1 = node.adj;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          neighbour = _ref1[_j];
          if (neighbour.node < node.num) {
            continue;
          }
          coords_end = this.coords[neighbour.node];
          this.canvas.beginPath();
          this.canvas.lineWidth = 2;
          this.canvas.fillStyle = 'black';
          this.canvas.moveTo(coords_begin.x, coords_begin.y);
          this.canvas.lineTo(coords_end.x, coords_end.y);
          this.canvas.stroke();
          edge_value = {
            edge: neighbour.dist,
            x: Math.floor(Math.abs((coords_end.x + coords_begin.x) / 2)),
            y: Math.floor(Math.abs((coords_end.y + coords_begin.y) / 2))
          };
          edge_values.push(edge_value);
        }
      }
      _results = [];
      for (_k = 0, _len2 = edge_values.length; _k < _len2; _k++) {
        e = edge_values[_k];
        this.canvas.beginPath();
        this.canvas.lineWidth = 1;
        this.canvas.rect(e.x - 9, e.y - 6, 18, 12);
        this.canvas.fillStyle = this.colors.blue;
        this.canvas.fill();
        this.canvas.stroke();
        this.canvas.fillStyle = 'black';
        this.canvas.font = 'bold 12px Georgia';
        _results.push(this.canvas.fillText(e.edge, e.x - 4, e.y + 3));
      }
      return _results;
    };

    GraphView.prototype.draw_all_nodes = function() {
      var node, _i, _len, _ref, _results;
      _ref = this.nodes.slice(1);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push(this.draw_node(node));
      }
      return _results;
    };

    GraphView.prototype.draw_node = function(node) {
      var coord, node_color, node_dist;
      coord = this.coords[node.num];
      node_color = this.graph_states[this.current_state].colors[node.num];
      this.canvas.beginPath();
      this.canvas.arc(coord.x, coord.y, 12, 2 * Math.PI, false);
      this.canvas.fillStyle = node_color;
      this.canvas.fill();
      this.canvas.lineWidth = 2;
      this.canvas.strokeStyle = 'black';
      this.canvas.stroke();
      this.canvas.fillStyle = 'black';
      this.canvas.font = 'bold 15px Georgia';
      this.canvas.fillText(node.name, coord.x - 5, coord.y + 5);
      node_dist = this.graph_states[this.current_state].distances[node.num];
      if (node_dist === 2147483647) {
        node_dist = '--';
      }
      this.canvas.beginPath();
      this.canvas.lineWidth = 1;
      this.canvas.rect(coord.x - 16, coord.y + 14, 32, 13);
      this.canvas.fillStyle = this.colors.orange;
      this.canvas.fill();
      this.canvas.stroke();
      this.canvas.fillStyle = 'black';
      this.canvas.font = 'bold 12px Georgia';
      return this.canvas.fillText("d: " + node_dist, coord.x - 14, coord.y + 24);
    };

    GraphView.prototype.update = function(node, mode) {
      var new_state;
      new_state = _.clone(this.graph_states[this.current_state]);
      new_state.distances[node.num] = node.distance;
      if (mode === 'visited') {
        new_state.colors[node.num] = this.colors.green;
      } else if (mode === 'updated') {
        new_state.colors[node.num] = this.colors.orange;
      }
      this.graph_states.push(new_state);
      this.current_state++;
      return this.draw_node(node);
    };

    return GraphView;

  })();

  App = (function() {

    function App() {
      this.test_graph = __bind(this.test_graph, this);

      this.process_nodes = __bind(this.process_nodes, this);

      this.dijkstra = __bind(this.dijkstra, this);

      this.generate_graph = __bind(this.generate_graph, this);
      this.graph_view = new GraphView('graphCanvas');
    }

    App.prototype.generate_graph = function() {
      this.g = new Graph();
      this.test_graph();
      return this.graph_view.generate(this.g);
    };

    App.prototype.dijkstra = function() {
      this.q = new Queue(this.g.nodes);
      this.t = this.q.t;
      this.g.nodes[1].distance = 0;
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
          return _this.process_nodes(current);
        }), 1000);
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
            return _this.process_nodes(node, i + 1);
          }), 1000);
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
