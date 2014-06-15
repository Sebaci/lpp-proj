(function() {
  var GNode, Graph,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  GNode = (function() {

    function GNode(name, num) {
      this.name = name;
      this.num = num != null ? num : null;
      this.adj = [];
      this.distance = 1000000;
      this.visited = false;
    }

    return GNode;

  })();

  Graph = (function() {

    function Graph() {
      this.add_edge = __bind(this.add_edge, this);

      this.add_node = __bind(this.add_node, this);
      this.nodes = [new GNode('fake')];
      this.size = 0;
    }

    Graph.prototype.add_node = function(name) {
      this.size++;
      return this.nodes.push(new GNode(name, this.size));
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

  window.Gnode = GNode;

  window.Graph = Graph;

}).call(this);
