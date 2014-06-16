#<< graph
#<< queue
#<< rand
#<< graph_view
#<< queue_view
#<< states_list

class App
  initialize_views: (graph_canvas, queue_canvas) =>
    @graph_view = new GraphView 'graphCanvas'
    @queue_view = new QueueView 'queueCanvas'
    @states_list = new StatesList 'statesList', @graph_view, @queue_view

    @exec = false

  constructor: ->
    @initialize_views()

    @letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P']

    @gen_btn = $('#generateGraph')
    @gen_btn.click =>
      @reset()
      @generate_graph()

      @gen_btn.prop 'disabled', true

  generate_graph: =>
    @g = new Graph()
    n = Rand.random min: 5, max: 12
    m = Rand.random min: n-1, max: 2 * n

    edges = ([] for i in [0..n])

    edge_values = []
    # generate at least one edge for each node
    joining_order = Rand.unique_random quantity: n-1, min: 2, max: n

    for i in joining_order
      j = Rand.random min: 1, max: i - 1
      edges[j].push i
      edge_values.push Rand.random min: 1, max: 9

    m = m - (n - 1)

    while m > 0
      i = Rand.random min: 1, max: n
      j = Rand.random min: 1, max: n

      if i == j or j in edges[i] or i in edges[j]
        continue
      edges[i].push j
      edge_values.push Rand.random min: 1, max: 9
      m--

    for i in [1..n]
      @g.add_node @letters[i - 1]

    k = 0
    for i in [1..n]
      for j in  edges[i]
        @g.add_edge i, j, edge_values[k++]

    @graph_view.generate @g
    @queue_view.generate @g

    @dijkstra()

  dijkstra: =>
    @q = new Queue(@g.nodes)
    @t = @q.t

    @g.nodes[1].distance = 0
    @graph_view.update @g.nodes[1], 'initial'
    @queue_view.update 'initial'
    @states_list.update()

    @process_nodes()

  process_nodes: (node = null, i = 0) =>
    if !node and @q.size == 0
      @gen_btn.prop 'disabled', false
      return

    # mode to next mode
    if !node and @q.size > 0
      setTimeout (=>
        current = @q.delete_min()

        @graph_view.update current, 'visited'
        @queue_view.update 'deleted'
        @states_list.update()

        @process_nodes current
      ), 300

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
          @q.heapify_up nbr_index

          @graph_view.update current, 'updated'
          @queue_view.update()
          @states_list.update()

          @process_nodes node, i+1
        ), 300

  reset: =>
    @graph_canvas = @graph_view.canvas.clearRect(0, 0, 570, 630)
    @queue_canvas = @queue_view.canvas.clearRect(0, 0, 480, 480)
    @states_list.list.empty()
    @initialize_views()


$ ->
  app = new App()