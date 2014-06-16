#<< graph
#<< queue
#<< rand

class GraphView
  constructor: (canvas) ->
    @canvas = document.getElementById(canvas).getContext('2d')
    @graph_states = []

    @colors =
      green: '#7aee3c'
      red: '#ff5d40'
      blue: '#4188D2'
      orange: '#ffc040'

  generate: (graph) =>
    @nodes = graph.nodes
    @size = @nodes.length - 1

    @generate_coords()
    initial_state =
      colors: (@colors.red for i in [0..@size])
      distances: (node.distance for node in @nodes)
      info: 'Stan początkowy'

    @graph_states.push initial_state
    @current_state = 0

    @draw_graph()

  generate_coords: =>
    x_random = Rand.unique_random quantity: @size, min: 1, max: 15
    y_random = Rand.unique_random quantity: @size, min: 1, max: 15

    spacing = 30
    x_pos = (pos * spacing for pos in x_random)
    y_pos = (pos * spacing for pos in y_random)

    @coords = [{x: null, y: null}] # fake position for fake node

    for i in [0..@size-1]
      coord =
        x: x_pos[i]
        y: y_pos[i]
      @coords.push coord

  draw_graph: =>
    @draw_edges()

    @draw_all_nodes()

  draw_edges: =>
    edge_values = []

    for node in @nodes[1..]
      coords_begin = @coords[node.num]
      for neighbour in node.adj
        if neighbour.node < node.num then continue # don't draw edge to previous nodes
        coords_end = @coords[neighbour.node]

        @canvas.beginPath()
        @canvas.lineWidth = 2
        @canvas.fillStyle = 'black'
        @canvas.moveTo coords_begin.x, coords_begin.y
        @canvas.lineTo coords_end.x, coords_end.y
        @canvas.stroke()

        edge_value =
          edge: neighbour.dist
          x: Math.floor(Math.abs((coords_end.x + coords_begin.x) / 2))
          y: Math.floor(Math.abs((coords_end.y + coords_begin.y) / 2))

        edge_values.push edge_value

    # draw edge values after lines
    for e in edge_values
      @canvas.beginPath()
      @canvas.lineWidth = 1
      @canvas.rect e.x - 9, e.y - 6, 18, 12
      @canvas.fillStyle = @colors.blue
      @canvas.fill()
      @canvas.stroke()

      @canvas.fillStyle = 'black'
      @canvas.font = 'bold 12px Georgia'
      @canvas.fillText e.edge, e.x-4, e.y+3

  draw_all_nodes: =>
    @draw_node(node) for node in @nodes[1..]

  draw_node: (node) =>
    coord = @coords[node.num]
    node_color = @graph_states[@current_state].colors[node.num]

    @canvas.beginPath()
    @canvas.arc coord.x, coord.y, 12, 2 * Math.PI, false
    @canvas.fillStyle = node_color
    @canvas.fill()

    @canvas.lineWidth = 2
    @canvas.strokeStyle = 'black'
    @canvas.stroke()

    @canvas.fillStyle = 'black'
    @canvas.font = 'bold 15px Georgia'
    @canvas.fillText node.name, coord.x-5, coord.y+5

    # distance
    node_dist = @graph_states[@current_state].distances[node.num]
    node_dist = '--' if node_dist == 2147483647

    @canvas.beginPath()
    @canvas.lineWidth = 1
    @canvas.rect coord.x - 16, coord.y + 14, 32, 13
    @canvas.fillStyle = @colors.orange
    @canvas.fill()
    @canvas.stroke()

    @canvas.fillStyle = 'black'
    @canvas.font = 'bold 12px Georgia'
    @canvas.fillText "d: #{node_dist}", coord.x - 14, coord.y + 24

  update: (node, mode) =>
    new_state = _.clone @graph_states[@current_state]

    new_state.distances[node.num] = node.distance
    if mode == 'visited'
      new_state.colors[node.num] = @colors.green
      new_state.info = "Odwiedzono #{node.name}"
    else if mode == 'updated'
      new_state.colors[node.num] = @colors.orange
      new_state.info = "Zaktualizowano #{node.name}"

    @graph_states.push new_state
    @current_state++

    @draw_node node

  restore_state

class App
  constructor: ->
    @graph_view = new GraphView 'graphCanvas'

  generate_graph: =>
    @g = new Graph()
    # should get n from input 5 <= n <= 15

    # should generate some nodes here
    @test_graph()

    @graph_view.generate @g


  dijkstra: =>
    @q = new Queue(@g.nodes)
    @t = @q.t

    @g.nodes[1].distance = 0

    @process_nodes()

  process_nodes: (node = null, i = 0) =>

    # mode to next mode
    if !node and @q.size > 0
      setTimeout (=>
        current = @q.delete_min()

        @graph_view.update current, 'visited'

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
