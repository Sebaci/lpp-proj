class QueueView
  constructor: (canvas) ->
    @canvas = document.getElementById(canvas).getContext('2d')
    @queue_states = []

    @colors =
      red: '#ff5d40'
      orange: '#ffc040'

  generate: (graph) =>
    @nodes = graph.nodes

    @generate_coords()

  generate_coords: =>
    @coords = [0..15]
    @gen_coord 1, Math.ceil(@coords.length / 2), 1

  gen_coord: (n, position, level) =>
    return if n >= @coords.length
    @coords[n] =
      x: position * 30
      y: level * 30

    @gen_coord n * 2, position - Math.floor(@coords.length / Math.pow(2, level + 1)), level + 1
    @gen_coord n * 2 + 1, position + Math.floor(@coords.length / Math.pow(2, level + 1)), level + 1

  draw_queue: =>
    @canvas.clearRect(0, 0, 480, 480)
    size = @queue_states[@current_state].size
    return if size < 1

    for i in [1..size]
      @draw_node i

  draw_node: (i) =>
    size = @queue_states[@current_state].size

    name = @queue_states[@current_state].names[i]
    distance = @queue_states[@current_state].distances[i]
    distance = '∞' if distance == 2147483647
    coords = @coords[i]

    # draw edges to children (if exist)
    children_pos = [i * 2, i * 2 + 1]
    for child_pos in children_pos
      if child_pos <= size
        child_coords = @coords[child_pos]
        @canvas.beginPath()
        @canvas.lineWidth = 2
        @canvas.fillStyle = 'black'
        @canvas.moveTo coords.x, coords.y
        @canvas.lineTo child_coords.x, child_coords.y
        @canvas.stroke()

    # draw node itself
    color = if @queue_states[@current_state].distances[i] == 2147483647
      @colors.red
    else @colors.orange
    @canvas.beginPath()
    @canvas.lineWidth = 2
    @canvas.rect(coords.x - 14, coords.y - 14, 28, 28)
    @canvas.fillStyle = color
    @canvas.fill()
    @canvas.stroke()

    @canvas.fillStyle = 'black'
    @canvas.font = 'bold 14px Georgia'
    @canvas.fillText name, coords.x - 8, coords.y

    @canvas.font = 'bold 12px Georgia'
    @canvas.fillText 'd: ' + distance, coords.x - 13, coords.y + 10

  update: (mode = 'modified') =>
    new_state =
      names: (node.name for node in @nodes)
      distances: (node.distance for node in @nodes)
      size: null

    @queue_states.push new_state

    if mode == 'initial'
      @current_state = 0
      new_state.size = @nodes.length - 1
    else
      current_size = @queue_states[@current_state].size
      if mode == 'deleted'
        new_state.size =  current_size - 1
      else
        new_state.size = current_size

      @current_state++

    @draw_queue()

  restore_state: (state) =>
    @current_state = state
    @draw_queue()


window.QueueView = QueueView