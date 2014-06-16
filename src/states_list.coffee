class StatesList
  constructor: (@list_id, @graph_view, @queue_view) ->
    @list = $("##{@list_id}")
    console.log @list
    @last_selected = null
    @last_color = null

  update: ->
    state_number = @graph_view.graph_states.length - 1
    graph_state = @graph_view.graph_states[state_number]

    state = $("<li></li>")
    color = if graph_state.type == 'visit'
      @graph_view.colors.green
    else if graph_state.type == 'update'
      @graph_view.colors.orange
    else if graph_state.type == 'initial'
      @graph_view.colors.blue

    state.css('background-color', color)

    state.html graph_state.info

    state.click =>
      console.log @last_color
      console.log state_number
      console.log @last_selected

      @graph_view.restore_state state_number
      @queue_view.restore_state state_number
      if @last_selected
        $("##{@list_id} li:nth-child(#{@last_selected+1})").css('background-color', @last_color)
      @last_selected = state_number
      @last_color = color

      state.css('background-color', @graph_view.colors.blue)


    @list.append state

window.StatesList = StatesList