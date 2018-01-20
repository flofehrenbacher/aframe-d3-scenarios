/* globals AFRAME */
AFRAME.registerComponent('animals-d3', {
  init: function () {
    // for converting Strings to Ints
    var rowConverter = function(d) {
      return {
        rank: parseInt(d.rank),
        numbersleft: parseInt(d.numbersleft)
      };
    }

    var heightScale = d3.scaleLinear()
      .range([0,5]);

    var colorScale = d3.scaleLinear()
      .range(['red','orange','green']);

    d3.csv('data/animals.csv', rowConverter, function(data) {
      var maxNumbersleft = d3.max(data, function(d){return d.numbersleft });
      heightScale.domain([0, maxNumbersleft]);
      colorScale.domain([0, maxNumbersleft/2, maxNumbersleft]);

      var scene = d3.select('a-scene');
      var bars = scene.selectAll('a-cylinder.bar')
        .data(data)
        .enter()
        .append('a-cylinder')
        .attrs({
          radius: 0.8,
          position: function(d,i) {
            var radius = 10;
            var angle = (i/data.length) * (2 * Math.PI) + Math.PI*1.5
            var x = radius * Math.cos(angle);
            var y = heightScale(d.numbersleft)/2;
            var z = radius * Math.sin(angle);
            return x + ' ' + y + ' ' + z
          },
          height: function(d) {
            return heightScale(d.numbersleft);
          },
          color: function(d) {
            return colorScale(d.numbersleft)
          }
        });
    });
  }
});
