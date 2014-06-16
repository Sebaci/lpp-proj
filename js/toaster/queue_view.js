(function() {
  var QueueView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  QueueView = (function() {

    function QueueView(canvas) {
      this.restore_state = __bind(this.restore_state, this);

      this.update = __bind(this.update, this);

      this.draw_node = __bind(this.draw_node, this);

      this.draw_queue = __bind(this.draw_queue, this);

      this.gen_coord = __bind(this.gen_coord, this);

      this.generate_coords = __bind(this.generate_coords, this);

      this.generate = __bind(this.generate, this);
      this.canvas = document.getElementById(canvas).getContext('2d');
      this.queue_states = [];
      this.colors = {
        red: '#ff5d40',
        orange: '#ffc040'
      };
    }

    QueueView.prototype.generate = function(graph) {
      this.nodes = graph.nodes;
      return this.generate_coords();
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
        x: position * 30,
        y: level * 30
      };
      this.gen_coord(n * 2, position - Math.floor(this.coords.length / Math.pow(2, level + 1)), level + 1);
      return this.gen_coord(n * 2 + 1, position + Math.floor(this.coords.length / Math.pow(2, level + 1)), level + 1);
    };

    QueueView.prototype.draw_queue = function() {
      var i, size, _i, _results;
      this.canvas.clearRect(0, 0, 480, 480);
      size = this.queue_states[this.current_state].size;
      if (size < 1) {
        return;
      }
      _results = [];
      for (i = _i = 1; 1 <= size ? _i <= size : _i >= size; i = 1 <= size ? ++_i : --_i) {
        _results.push(this.draw_node(i));
      }
      return _results;
    };

    QueueView.prototype.draw_node = function(i) {
      var child_coords, child_pos, children_pos, color, coords, distance, name, size, _i, _len;
      size = this.queue_states[this.current_state].size;
      name = this.queue_states[this.current_state].names[i];
      distance = this.queue_states[this.current_state].distances[i];
      if (distance === 2147483647) {
        distance = '∞';
      }
      coords = this.coords[i];
      children_pos = [i * 2, i * 2 + 1];
      for (_i = 0, _len = children_pos.length; _i < _len; _i++) {
        child_pos = children_pos[_i];
        if (child_pos <= size) {
          child_coords = this.coords[child_pos];
          this.canvas.beginPath();
          this.canvas.lineWidth = 2;
          this.canvas.fillStyle = 'black';
          this.canvas.moveTo(coords.x, coords.y);
          this.canvas.lineTo(child_coords.x, child_coords.y);
          this.canvas.stroke();
        }
      }
      color = this.queue_states[this.current_state].distances[i] === 2147483647 ? this.colors.red : this.colors.orange;
      this.canvas.beginPath();
      this.canvas.lineWidth = 2;
      this.canvas.rect(coords.x - 14, coords.y - 14, 28, 28);
      this.canvas.fillStyle = color;
      this.canvas.fill();
      this.canvas.stroke();
      this.canvas.fillStyle = 'black';
      this.canvas.font = 'bold 14px Georgia';
      this.canvas.fillText(name, coords.x - 8, coords.y);
      this.canvas.font = 'bold 12px Georgia';
      return this.canvas.fillText('d: ' + distance, coords.x - 13, coords.y + 10);
    };

    QueueView.prototype.update = function(mode) {
      var current_size, new_state, node;
      if (mode == null) {
        mode = 'modified';
      }
      new_state = {
        names: (function() {
          var _i, _len, _ref, _results;
          _ref = this.nodes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.name);
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
        size: null
      };
      this.queue_states.push(new_state);
      if (mode === 'initial') {
        this.current_state = 0;
        new_state.size = this.nodes.length - 1;
      } else {
        current_size = this.queue_states[this.current_state].size;
        if (mode === 'deleted') {
          new_state.size = current_size - 1;
        } else {
          new_state.size = current_size;
        }
        this.current_state++;
      }
      return this.draw_queue();
    };

    QueueView.prototype.restore_state = function(state) {
      this.current_state = state;
      return this.draw_queue();
    };

    return QueueView;

  })();

  window.QueueView = QueueView;

}).call(this);
