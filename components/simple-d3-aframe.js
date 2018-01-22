AFRAME.registerComponent('simple-d3-aframe', {
  init: function () {
    var rowConverter = function(d) {
      return {
        rank: parseInt(d.rank),
        animal: d.animal,
        numbersleft: parseInt(d.numbersleft)
      };
    }

    var heightScale = d3.scaleLinear()
      .range([0,4]);
    var colorScale = d3.scaleLinear()
      .range(['red','orange','green']);

    d3.csv('data/simple-d3-aframe.csv', rowConverter, function(data) {
      var maxNumbers = d3.max(data, function(d){ return d.numbersleft });
      heightScale.domain([0, maxNumbers]);
      colorScale.domain([0, maxNumbers/2, maxNumbers]);

      var scene = d3.select('a-scene');
      var bars = scene.selectAll('a-cylinder')
        .data(data).enter()
        .append('a-cylinder')
        .attrs({
          position: function(d,i) {
            var x = i*0.5 - 4;
            var y = heightScale(d.numbersleft)/2;
            var z = -4;
            return x + ' ' + y + ' ' + z
          },
          radius: 0.2,
          height: function(d) {
            return heightScale(d.numbersleft)
          },
          color: function(d) {
            return colorScale(d.numbersleft)
          },
          shadow: ''
        });
    });
  }
});
