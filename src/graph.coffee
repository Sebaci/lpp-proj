class GNode
  constructor: (@name, @num = null) ->
    @adj = []
    @distance = 2147483647 # 2^31-1
    @visited = false

class Graph
  constructor: ->
    @nodes = [new GNode('fake')] # fake node just to count from 1 instead of 0
    @size = 0

  add_node: (name) =>
    @size++
    @nodes.push new GNode(name, @size)

  add_edge: (node_1, node_2, value) =>
    neighbour_1 =
      node: node_2
      dist: value

    neighbour_2 =
      node: node_1
      dist: value

    @nodes[node_1].adj.push neighbour_1
    @nodes[node_2].adj.push neighbour_2

window.Gnode = GNode
window.Graph = Graph