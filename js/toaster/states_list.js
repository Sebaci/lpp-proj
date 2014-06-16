(function() {
  var StatesList;

  StatesList = (function() {

    function StatesList(list_id, graph_view) {
      this.list_id = list_id;
      this.graph_view = graph_view;
      this.list = $("#" + this.list_id);
      console.log(this.list);
      this.last_selected = null;
      this.last_color = null;
    }

    StatesList.prototype.update = function() {
      var color, graph_state, state, state_number,
        _this = this;
      state_number = this.graph_view.graph_states.length - 1;
      graph_state = this.graph_view.graph_states[state_number];
      state = $("<li></li>");
      color = graph_state.type === 'visit' ? this.graph_view.colors.green : graph_state.type === 'update' ? this.graph_view.colors.orange : graph_state.type === 'initial' ? this.graph_view.colors.blue : void 0;
      state.css('background-color', color);
      state.html(graph_state.info);
      state.click(function() {
        console.log(_this.last_color);
        console.log(state_number);
        console.log(_this.last_selected);
        _this.graph_view.restore_state(state_number);
        if (_this.last_selected) {
          $("#" + _this.list_id + " li:nth-child(" + (_this.last_selected + 1) + ")").css('background-color', _this.last_color);
        }
        _this.last_selected = state_number;
        _this.last_color = color;
        return state.css('background-color', _this.graph_view.colors.blue);
      });
      return this.list.append(state);
    };

    return StatesList;

  })();

  window.StatesList = StatesList;

}).call(this);
