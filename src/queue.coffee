class Queue
  constructor: (@nodes) ->
    @size = @nodes.length - 1
    @t = [0..@size] # transform table for swapping nodes in array

  delete_min: =>
    min = @nodes[1]
    min.visited = true
    @swap 1, @size # move minimum behind queue
    @size--
    @heapify_down 1
    return min

  heapify: (index) =>
    @heapify_down index
    @heapify_up index

  heapify_down: (index) =>
    lesser_son = index * 2

    while lesser_son <= @size
      if lesser_son < @size and @nodes[lesser_son+ 1].distance < @nodes[lesser_son].distance
        lesser_son++

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

window.Queue = Queue