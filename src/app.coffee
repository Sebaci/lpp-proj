#<< graph
#<< queue
#<< rand
#<< graph_view
#<< states_list

class QueueView
  constructor: (canvas) ->
    @canvas = document.getElementById(canvas).getContext('2d')
    @queue_states = []

    @colors =
      red: '#ff5d40'
      blue: '#4188D2'

  generate: (graph) =>
    @nodes = graph.nodes
    @size = @nodes.length - 1

    @generate_coords()

  generate_coords: ->
    @coords = [0..15]
    @gen_coord 1, Math.ceil(@coords.length / 2), 1

  gen_coord: (n, position, level) ->
    return if n >= @coords.length
    @coords[n] =
      x: position * 80
      y: level * 80

    @gen_coord n * 2, position - Math.floor(@coords.length / Math.pow(2, level + 1)), level + 1
    @gen_coord n * 2 + 1, position + Math.floor(@coords.length / Math.pow(2, level + 1)), level + 1

class App
  constructor: ->
    @graph_view = new GraphView 'graphCanvas'
    @queue_view = new QueueView 'queueCanvas'

    @states_list = new StatesList 'statesList', @graph_view

  generate_graph: =>
    @g = new Graph()

    # should get n from input 5 <= n <= 15

    # should generate some nodes here
    @test_graph()

    @graph_view.generate @g
    @queue_view.generate @g


  dijkstra: =>
    @q = new Queue(@g.nodes)
    @t = @q.t

    @g.nodes[1].distance = 0
    @graph_view.update @g.nodes, 'initial'
    @states_list.update()

    @process_nodes()

  process_nodes: (node = null, i = 0) =>

    # mode to next mode
    if !node and @q.size > 0
      setTimeout (=>
        current = @q.delete_min()

        @graph_view.update current, 'visited'
        @states_list.update()


        @process_nodes current
      ), 700

    # update neighbours
    else if node
      if i >= node.adj.length
        @process_nodes()
        return

      neighbour = node.adj[i]
      nbr_index = @t[neighbour.node]
      current = @g.nodes[nbr_index]

      new_distance = node.distance + neighbour.dist

      # skip current neighbour if distance cannot be improved
      if new_distance >= current.distance
        @process_nodes node, i+1

      else
        setTimeout (=>
          current.distance = new_distance
          @q.heapify nbr_index

          @graph_view.update current, 'updated'
          @states_list.update()

          @process_nodes node, i+1
        ), 700


  test_graph: =>
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

  app.generate_graph()
  app.dijkstra()
#  app.dj()
#  foo = (opts) =>
#    {one, two, three} = opts
#    if one
#      console.log 'one!'
