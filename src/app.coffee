class Node
  constructor: (@name, @num = null) ->
    @adj = []
    @distance = 1000000 # to change
    @visited = false

class Graph
  constructor: ->
    @nodes = [new Node('fake')] # fake node just to count from 1 instead of 0
    @size = 0

  add_node: (name) =>
    @size += 1
    @nodes.push new Node(name, @size)

  add_edge: (node_1, node_2, value) =>
    neighbour_1 =
      node: node_2
      dist: value

    neighbour_2 =
      node: node_1
      dist: value

    @nodes[node_1].adj.push neighbour_1
    @nodes[node_2].adj.push neighbour_2

class Queue
  constructor: (@nodes) ->
    @size = @nodes.length - 1
    @t = [0..@size] # transform table for swapping nodes in array

  delete_min: =>
    min = @nodes[1]
    min.visited = true
    @swap 1, @size # move minimum behind queue
    @size -= 1
    @heapify_down 1
    return min

  heapify: (index) =>
    @heapify_down index
    @heapify_up index

  heapify_down: (index) =>
    lesser_son = index * 2

    while lesser_son <= @size
      if lesser_son < @size and @nodes[lesser_son+ 1].distance < @nodes[lesser_son].distance
        lesser_son += 1

      if @nodes[index] > @nodes[lesser_son]
        @swap index, lesser_son
        index = lesser_son
        lesser_son *= 2
      else break

  heapify_up: (index) =>
    parent = Math.floor index / 2
    while parent >= 1 and @nodes[parent].distance > @nodes[index].distance
      @swap index, parent
      index = parent

  swap: (i, j) =>
    @index_transform i, j
    tmp = @nodes[j]
    @nodes[j] = @nodes[i]
    @nodes[i] = tmp

  index_transform: (i, j) =>
    @t[@nodes[i].num] = j
    @t[@nodes[j].num] = i

class App
  constructor: ->
    @set_graph_canvas()

  set_graph_canvas: ->
    canvas = document.getElementById('graphCanvas')
    @graphCanvas = canvas.getContext('2d')
    margin = 15
    [@minX, @minY] = [margin, margin]
    [@maxX, @maxY] = [canvas.width - margin, canvas.height - margin]

  generate_graph: ->
    @g = new Graph()



  dijkstra: ->
    @q = new Queue(@g.nodes)

    @t = @q.t

    # Dijkstra
    @g.nodes[1].distance = 0
    while @q.size > 0
      current = @q.delete_min()

      for neighbour in current.adj
        nbr_index = @t[neighbour.node]

        new_distance = current.distance + neighbour.dist

        if new_distance < @q.nodes[nbr_index].distance
          @q.nodes[nbr_index].distance = new_distance
          @q.heapify nbr_index

    console.log '---'
    for i in [1..@g.size]
      console.log i, ': ', @q.nodes[@t[i]].distance


  test_graph: =>
    @g = new Graph()
    @g.add_node 'A'
    @g.add_node 'B'
    @g.add_node 'C'
    @g.add_node 'D'
    @g.add_node 'E'
    @g.add_node 'F'

    @g.add_edge 1, 2, 2
    @g.add_edge 1, 6, 1
    @g.add_edge 1, 5, 3
    @g.add_edge 4, 1, 5
    @g.add_edge 2, 6, 2
    @g.add_edge 2, 3, 5
    @g.add_edge 4, 3, 4
    @g.add_edge 3, 5, 4
    @g.add_edge 4, 5, 4
    @g.add_edge 5, 6, 3


$ ->
  app = new App()

  app.test_graph()
  app.dijkstra()

