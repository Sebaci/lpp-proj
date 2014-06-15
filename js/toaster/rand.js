(function() {
  var Rand;

  Rand = (function() {

    function Rand() {}

    Rand.random = function(opts) {
      var max, min;
      min = opts.min, max = opts.max;
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    Rand.unique_random = function(opts) {
      var max, min, numbers, quantity, results, selected, temp, _i, _results;
      quantity = opts.quantity, min = opts.min, max = opts.max;
      if (numbers > (max - min + 1)) {
        return [];
      }
      results = [];
      numbers = (function() {
        _results = [];
        for (var _i = min; min <= max ? _i <= max : _i >= max; min <= max ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this);
      while (quantity > 0) {
        selected = Rand.random({
          min: 0,
          max: numbers.length - 1
        });
        temp = numbers[0];
        numbers[0] = numbers[selected];
        numbers[selected] = temp;
        results.push(numbers.shift());
        quantity--;
      }
      return results;
    };

    return Rand;

  }).call(this);

  window.Rand = Rand;

}).call(this);
