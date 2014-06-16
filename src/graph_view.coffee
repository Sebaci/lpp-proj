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

  restore_state: (state) =>
    @current_state = state

    @draw_all_nodes()

window.GraphView = GraphView